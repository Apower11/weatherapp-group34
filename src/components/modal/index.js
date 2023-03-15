// import preact
import { h, render, Component } from 'preact';
import modal from './modal';
	
export default class Button extends Component {

    constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ locationName: "" });
		this.setState({ givenAddress: "" });
        this.setState({ weatherTime: "00:00" });
	}

    addTimestamp = () => {
        this.props.addTimestamp(this.state.locationName,this.state.weatherTime, this.state.givenAddress);
        this.setState({ locationName: "" });
		this.setState({ givenAddress: "" });
        this.setState({ weatherTime: "00:00" });
    }

	// rendering a function when the button is clicked
	render() {
		let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = () => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
        
		return (
			<div class={this.props.onTablet ? modal.modal_tablet : modal.modal}>
				<div class={modal.modal_content}>
                    <nav class={modal.modal_header}>
                        <button onClick={this.props.closeModal} class={modal.cancel_button}>
                            Cancel
                        </button>
                        <button onClick={() => this.addTimestamp()} class={modal.add_button}>
                            Add
                        </button>
                    </nav>
                    <div class={modal.modal_inputs}>
                    <div class={modal.modal_input}>
                            <input value={this.state.weatherTime} onChange={(e) => {this.setState({weatherTime: e.target.value})}} type="time" />
                        </div>
                        <div class={modal.modal_input}>
                            <input value={this.state.locationName} onChange={(e) => {this.setState({locationName: e.target.value})}} type="text" placeholder="Name" />
                            <button onClick={() => {this.setState({ locationName: "" })}} class={modal.input_clear_button}>
                                <span class="material-symbols-outlined">cancel</span>
                            </button>
                        </div>
                        <div class={modal.modal_input}>
                            <span class="material-symbols-outlined">search</span>
                            <input value={this.state.givenAddress} onChange={(e) => {this.setState({givenAddress: e.target.value})}} class={modal.modal_search_input} type="text" placeholder="Location" />
                            <span class="material-symbols-outlined">mic</span>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
}
