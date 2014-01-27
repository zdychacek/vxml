'use strict';

var Helpers = require('../Helpers'),
	vxml = require('../../index'),
	GetDateDtmfComponent = require('./GetDateDtmfComponent');

var DateDifferenceCtrl = vxml.CallFlow.extend({
	constructor: function () {
		this.startDate = null;
		this.finishDate = null;

		DateDifferenceCtrl.super.call(this);
	},

	create: function *() {
		var appProperties = {
			inputmode: 'dtmf'
		};

		yield Helpers.delay(250);

		this.addState(
			vxml.State.create('greeting', new vxml.Say({
				prompt: new vxml.Prompt({
					text: 'Welcome to the date difference calculator.',
					bargein: false
				}),
				properties: appProperties
			}), 'getStartDate'), true
		);

		this.addState(
			new vxml.State('getStartDate', 'getFinishDate')
				.addNestedCallFlow(
					new GetDateDtmfComponent('Enter the start date as a eight digit number.')
				)
				.addOnExitAction(function* (cf, state, event) {
					cf.startDate = state.nestedCF.getDate();
				})
		);

		this.addState(
			new vxml.State('getFinishDate', 'calcDifference')
				.addNestedCallFlow(
					new GetDateDtmfComponent('Enter the finish date as a eight digit number.')
				)
				.addOnExitAction(function* (cf, state, event) {
					cf.finishDate = state.nestedCF.getDate();
				})
		);

		this.addState(
			new vxml.State('calcDifference', 'differenceInDays')
				.addOnEntryAction(function* (cf, state, event) {
						cf.daysDiff = cf._computeDaysDifference(cf.startDate, cf.finishDate);

						console.log('Difference between ' + cf.startDate + ' and ' + cf.finishDate + ' is ' + cf.daysDiff + ' days.');

						yield cf.fireEvent('continue');
				})
		);

		var sayDiff = new vxml.Prompt();
		sayDiff.audios = [
			new vxml.TtsMessage('The difference between the start and finish dates is '),
			new vxml.TtsMessage(new vxml.Var(this, 'daysDiff')),
			new vxml.TtsMessage(' days.'),
			new vxml.Silence('1000s')
		];
		sayDiff.bargein = false;

		this.addState(
			vxml.State.create('differenceInDays', new vxml.Say(sayDiff), 'goodbye')
		);

		this.addState(
			vxml.State.create('goodbye', new vxml.Exit('Goodbye.'))
		);
	},

	_computeDaysDifference: function (first, second) {
		var one = new Date(first.getFullYear(), first.getMonth(), first.getDate()),
			two = new Date(second.getFullYear(), second.getMonth(), second.getDate()),
			millisecondsPerDay = 1000 * 60 * 60 * 24,
			millisBetween = two.getTime() - one.getTime(),
			days = millisBetween / millisecondsPerDay;

		return Math.floor(days);
	}
});

module.exports = DateDifferenceCtrl;
