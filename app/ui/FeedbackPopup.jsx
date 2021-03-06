import "ui/FeedbackPopup.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import api from "api.js";

import LoadingIndicator from "ui/LoadingIndicator.jsx";

class FeedbackPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: "",
			message: "",
			error: false,
			loading: false,
			sent: false
		};
	}

	selectFeeling(type) {
		this.setState({
			type: type
		}, function() {
			document.querySelector(".feedbackPopupMessage").focus();
		});
	}

	submit() {
		var that = this;
		if (this.state.message.trim() == "") {
			this.setState({
				error: true
			}, function() {
				document.querySelector(".feedbackPopupMessage").focus();
			});
			return;
		}
		this.setState({
			loading: true,
			error: false
		}, function() {
			api.post("feedback/add", {
				type: that.state.type,
				text: that.state.message
			}, function(xhr) {
				that.setState({
					loading: false,
					sent: true
				});
			});
		});
	}

	keyup() {
		if (this.state.error) {
			this.setState({
				error: false
			});
		}
	}

	render(props, state) {
		if (state.sent) {
			return <span class="feedbackPopup feedbackPopupExtended feedbackPopupSuccess">
				<div class="feedbackPopupHeading">Thanks for the feedback!</div>
				<p>Your feedback has been successfully sent. We will look at it, and if needed, reply.</p>
			</span>;
		}

		var feelingIndicator = <div class="feedbackPopupFeeling">
			<div class="feedbackPopupHeading">How do you feel?</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "smile" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "smile")}><i class="fa fa-fw fa-smile-o" /> I'm happy</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "frown" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "frown")}><i class="fa fa-fw fa-frown-o" /> I'm sad</div>
			<div class={`feedbackPopupFeelingOption ${state.type == "idea" ? "selected" : ""}`} onClick={this.selectFeeling.bind(this, "idea")}><i class="fa fa-fw fa-lightbulb-o" /> I have an idea</div>
		</div>;

		if (state.type == "") {
			return <span class="feedbackPopup">
				{feelingIndicator}
			</span>;
		} else {
			return <span class={`feedbackPopup feedbackPopupExtended ${state.error ? "has-error" : ""}`}>
				<div class="row">
					<div class="feedbackPopupCol col-md-5 feedbackPopupFeeling">
						{feelingIndicator}
					</div>
					<div class="feedbackPopupCol col-md-7 feedbackPopupMessageContainer">
						<div class="feedbackPopupHeading">Tell us more...</div>
						<textarea class="feedbackPopupMessage form-control" disabled={state.loading} value={state.message} onInput={linkState(this, "message")} onKeyup={this.keyup.bind(this)}></textarea>
						<div class="feedbackPopupMessageAction">
							<div>
								{!state.loading && <button class="btn btn-default btn-sm" onClick={this.submit.bind(this)}>Submit</button>}
								{state.loading && <button class="btn btn-default btn-sm" disabled={true}><LoadingIndicator type="inline" /> Loading...</button>}
							</div>
							<div class="feedbackPopupMessageActionInfo">Your name will also be sent.</div>
						</div>
					</div>
				</div>
			</span>;
		}
	}
}

export default FeedbackPopup;