'use strict';

var Class = require('class'),
	Helpers = require('../Helpers'),
	vxml = require('../../index');

var GetDateDtmfComponent = vxml.CallFlow.extend({
	constructor: function (askDatePrompt) {
		GetDateDtmfComponent.super.call(this);

		// zadane datum
		this.selectedDate = null;
		this.askDatePrompt = askDatePrompt;
	},

	create: function* () {
		var appProperties = {
			inputmode: 'dtmf'
		};

		yield Helpers.delay(250);

		this.addState(
			vxml.State.create('getDate', new vxml.Ask({
				prompt: new vxml.Prompt({
					text: this.askDatePrompt,
					bargein: false
				}),
				grammar: new vxml.BuiltinGrammar({
					type: 'digits',
					length: 8
				}),
				properties: appProperties
			}), 'validateDate'), true);

		this.addState(
			new vxml.State('validateDate', 'confirmDate')
				.addTransition('error', 'invalidDate')
				.addOnEntryAction(function* (cf, state, event) {
						var result = cf.validateDate(event.data);

						if (result.isValid) {
							cf.selectedDate = result.date;
							cf.voiceDate = cf.convert(result.date);

							yield cf.fireEvent('continue');
						}
						else {
							yield cf.fireEvent('error');
						}
				})
		);

		var confirmPrompt = new vxml.Prompt();
		confirmPrompt.audios = [
			new vxml.TtsMessage('You entered '),
			new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.day', ' ')),
			new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.month', ' ')),
			new vxml.TtsMessage(new vxml.Var(this, 'voiceDate.year')),
			new vxml.Silence(1000)
		];
		confirmPrompt.bargein = false;

		this.addState(
			vxml.State.create('confirmDate', new vxml.Say({
				prompt: confirmPrompt,
				properties: appProperties
			}))
		);

		this.addState(
			vxml.State.create('invalidDate', new vxml.Say({
				prompt: new vxml.Prompt({
					text: 'You entered an invalid date.',
					bargein: false
				}),
				properties: appProperties
			}), 'getDate')
		);
	},

	getDate: function () {
		return this.selectedDate;
	},

	validateDate: function (sDate) {
		var day = sDate.substr(0, 2),
			month = sDate.substr(2, 2),
			year = sDate.substr(4, 4);

		var daysInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		/* jshint ignore:start */
		if ((!(year % 4) && year % 100) || !(year % 400)) {
			daysInMonth[1] = 29;
		}
		/* jshint ignore:end */

		return {
			date: new Date(year, month - 1, day),
			isValid: (day <= daysInMonth[--month])
		};
	},

	convert: function (date) {
		var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

		return {
			day: date.getDate(),
			month: months[date.getMonth()],
			year: date.getFullYear()
		};
	}
});

module.exports = GetDateDtmfComponent;
