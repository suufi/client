import { h, Component } from "preact";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class CalendarSettings extends Component {
	constructor() {
		super();
		this.state = {
			loading: true
		};
	}

	componentWillMount() {
		this.refresh();
	}

	refresh() {
		var that = this;
		this.setState({
			loading: true
		}, function() {
			api.get("calendar/getStatus", {}, function(xhr) {
				if (xhr.responseJSON.statusNum == 1) {
					that.setState({
						loading: false,
						calendarEnabled: true
					});
				} else {
					that.setState({
						loading: false,
						calendarEnabled: false
					});
				}
			});
		});
	}

	reset() {
		if (confirm("This will clear your schedule information from the Calendar. Any homework or events you've added will remain, but you'll need to re-import your schedule if you want to use the Calendar again.\n\nContinue?")) {
			var that = this;
			this.setState({
				loading: true
			}, function() {
				api.post("calendar/resetSchedule", {}, function(xhr) {
					if (xhr.responseJSON.status == "ok") {
						alert("Schedule data has been cleared.");
						window.location.reload();
					} else {
						this.setState({
							loading: false
						}, function() {
							alert(errors.getFriendlyString(xhr.responseJSON.error));
						});
					}
				});
			});
		}
	}

	render(props, state) {
		var that = this;

		if (state.loading) {
			return <div><LoadingIndicator /> Loading, please wait...</div>;
		}
		if (!state.calendarEnabled) {
			return <div>You haven't enabled Calendar! Go to the Calendar tab to do so.</div>;
		}
		
		return <div>
			<button onClick={this.reset.bind(this)} class="btn btn-danger btn-sm">Reset schedule information</button>
		</div>;
	}
}

export default CalendarSettings;