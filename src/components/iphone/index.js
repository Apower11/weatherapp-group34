// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import './home.css';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import Modal from '../modal';
import WeatherTimestamp from '../weatherTimestamp';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		let weatherTimelineArray = [];
		weatherTimelineArray.push({time: "07:30",locationName: "London", weatherTemperature: 11, weatherCode: 3});
		weatherTimelineArray.push({time: "07:31",locationName: "London", weatherTemperature: 11, weatherCode: 51});
		weatherTimelineArray.push({time: "07:32",locationName: "London", weatherTemperature: 11, weatherCode: 0});
		// weatherTimelineArray.push({time: "19:56",locationName: "London", weatherTemperature: 11, weatherCode: 0});
		this.setState({ display: true });
		this.setState({ displayModal: false });
		this.setState({ weatherTimeline: weatherTimelineArray });
		this.setState({ newCoordinates: {latitude: 0, longitude: 0}});
		this.setState({ locationName: ''});
		this.setState({ weatherTime: '00:00' });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=cf17e23b1d108b29a4d738d2084baf5";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	closeModal = () => {
		this.setState({ displayModal: false });
	}

	openModal = () => {
		this.setState({ displayModal: true });
	}

	successCallback = (latitude, longitude) => {
		
		console.log("Latitude 1: " + latitude);
		console.log("Longitude 1: " + longitude);
		let temperature = 0;
		let weathercode = 0;
		this.setState({ newCoordinates: {latitude: latitude, longitude: longitude}});
		console.log(123);
		fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,rain,showers,weathercode,windspeed_10m,windgusts_10m`).then(res => {
			return res.json();
		}).then(actualData => {
			console.log(actualData);
			let weatherIndex = parseInt(this.state.weatherTime.split(":")[0]);
			temperature = actualData.hourly.temperature_2m[weatherIndex];
			weathercode = actualData.hourly.weathercode[weatherIndex];
			let newTimestamp = {time: this.state.weatherTime,locationName: this.state.locationName, weatherTemperature: temperature, weatherCode: weathercode};
			this.setState({ weatherTimeline: [...this.state.weatherTimeline,newTimestamp] });
			this.setState({locationName: ''});
			this.setState({ weatherTime: '00:00' });
			this.setState({ newCoordinates: {latitude: 0, longitude: 0}});
		})
		console.log("Temperature 2: " + temperature);
	};
	  
	errorCallback = (error) => {
		console.log(error);
	};

	addTimestamp = (locationName, weatherTime, givenAddress) => {
		this.setState({ locationName: locationName });
		this.setState({ weatherTime: weatherTime });
		let latitude = 0;
		let longitude = 0;
		let geocoder = new google.maps.Geocoder();
        console.log("Geocoder: " + geocoder);
        geocoder
            .geocode({ address: givenAddress })
            .then((result) => {
            const { results } = result;
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();
			this.successCallback(latitude,longitude);
            console.log("Results: " + results);
            })
            .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
            });
		// let temperature = 0;
		// let weathercode = 0;
		// this.setState({ newCoordinates: {latitude: position.coords.latitude, longitude: position.coords.longitude}});
		// console.log(123);
		// fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m,precipitation,rain,showers,weathercode,windspeed_10m,windgusts_10m`).then(res => {
		// 	return res.json();
		// }).then(actualData => {
		// 	console.log(actualData);
		// 	let weatherIndex = parseInt(this.state.weatherTime.split(":")[0]);
		// 	temperature = actualData.hourly.temperature_2m[weatherIndex];
		// 	weathercode = actualData.hourly.weathercode[weatherIndex];
		// 	let newTimestamp = {time: this.state.weatherTime,locationName: this.state.locationName, weatherTemperature: temperature, weatherCode: weathercode};
		// 	this.setState({ weatherTimeline: [...this.state.weatherTimeline,newTimestamp] });
		// })
		// console.log("Temperature 2: " + temperature);
		// this.setState({locationName: locationName});
		// this.setState({ weatherTime: weatherTime });
		// navigator.geolocation.getCurrentPosition(this.successCallback, this.errorCallback);
		this.setState({ displayModal: false });
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		let modal = null;
		// console.log(weatherTimelineArray);
		if(this.state.displayModal){
			modal = <Modal closeModal={this.closeModal} addTimestamp={this.addTimestamp} />
		}

		// display all weather data
		return (
			<div class={ style.main_container }>
				{modal}
				<nav class={ style.navbar }>
					<span class="material-symbols-outlined menu-icon">menu</span>
					<span class="material-symbols-outlined tune-icon">tune</span>
				</nav>
				<div class="timeline">
					{this.state.weatherTimeline.map((item,index) => {
						return <WeatherTimestamp key={index} time={item.time} locationName={item.locationName} temperature={item.weatherTemperature} weatherCode={item.weatherCode} />
					})}
  					<span onClick={this.openModal} class="material-symbols-outlined add-timestamp-button">add</span>
				</div>
				{/* <div class={ style.header }>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
				</div>
				<div class={ style.details }></div> */}
				{/* <div class= { style_iphone.container }> 
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > : null }
				</div> */}
				<div class={ style.bullet_points }>
					<div class={style.bullet_point}></div>
					<div class={style.bullet_point}></div>
					<div class={style.bullet_point_active}></div>
					<div class={style.bullet_point}></div>
					<div class={style.bullet_point}></div>
				</div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions
		});      
	}
}
