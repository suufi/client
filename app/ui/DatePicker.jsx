import "ui/DatePicker.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import $ from "jquery";
import moment from "moment";

import DatePickerCalendar from "ui/DatePickerCalendar.jsx";

class DatePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			bodyClick: this.onBodyClick.bind(this)
		};
	}

	onBodyClick(e) {
		if ($(e.target).closest(".datePickerCalendar").length == 0) {
			this.toggle();
		}
	}

	toggle(e) {
		if (e) {
			e.stopPropagation();
		}
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				$("body").bind("click", this.state.bodyClick);
			} else {
				$("body").unbind("click", this.state.bodyClick);
			}
		});
	}

	selectDate(date) {
		this.setState({
			open: false
		}, function() {
			$("body").unbind("click", this.state.bodyClick);
			this.props.change(date);
		});
	}

	render(props, state) {
		var format = props.format || "ddd, MMMM Do, YYYY";
		return <div class="datePickerContainer">
			<div class="datePicker" onClick={!state.open && this.toggle.bind(this)}>
				<div class="datePickerOutput">{props.value.format(format)}</div>
				<div class="datePickerAction"><i class={state.open ? "fa fa-chevron-circle-up" : "fa fa-chevron-circle-down"} /></div>
				<div class="datePickerClear"></div>
			</div>
			{state.open && <DatePickerCalendar date={props.value} selectDate={this.selectDate.bind(this)} />}
		</div>;
	}
}

export default DatePicker;