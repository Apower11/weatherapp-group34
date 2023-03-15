// import preact
import { h, render, Component } from 'preact';
import timestamp from './timestamp';
	
export default class Button extends Component {

    constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ locationName: "" });
	}

	// rendering a function when the button is clicked
	render() {
		let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = () => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
        let weatherIcon = 'air';
        let conditionsClass = 'container right light_blue';
        let weatherConditions = 'Sunny';
        switch(this.props.weatherCode){
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                weatherIcon = 'rainy';
                conditionsClass = 'container right light_blue';
                weatherConditions = 'Rain';
                break;
            case 0:
                if(this.props.time.split(":")[0] > 18 || this.props.time.split(":")[0] < 6){
                    weatherIcon = 'clear_night';
                    conditionsClass = 'container right dark_blue';
                    weatherConditions = 'Clear Sky';
                } else {
                    weatherIcon = 'sunny';
                    conditionsClass = 'container right yellow';
                    weatherConditions = 'Sunny';
                }
                break;
            case 71:
            case 73: 
            case 75:
            case 77:
            case 85:
            case 86:
                weatherIcon = 'weather_snowy';
                conditionsClass = 'container right light_blue';
                weatherConditions = 'Snow';
                break;
            case 45:
            case 48:
                weatherIcon = 'foggy';
                conditionsClass = 'container right dark_blue';
                weatherConditions = 'Foggy';
                break;
            case 95:
            case 96:
            case 99:
                weatherIcon = 'thunderstorm';
                conditionsClass = 'container right grey';
                weatherConditions = 'Thunderstorm';
                break;
            default:
                weatherIcon = 'cloud';
                conditionsClass = 'container right grey';
                weatherConditions = 'Cloudy';
        }
		return (
			<div class={conditionsClass}>
                <div class="date">
                    <div class="time">{this.props.time}</div>
                    <div class="location">{this.props.locationName}</div>
                </div>
                <i class="icon">
                    <span class="material-symbols-outlined">{weatherIcon}</span>
                </i>
                <div class="weather-info">
                    <div class="temperature">{this.props.temperature}°C</div>
                    <div class="conditions">{weatherConditions}</div>
                </div>
            </div>
		);
	}
}
