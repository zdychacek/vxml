'use strict';

var vxml = require('../../index');

var MenuExampleCtrl = vxml.CallFlow.extend({

	constructor: function () {
		// zavolani konstruktoru bazove tridy
		MenuExampleCtrl.super.call(this);
	},

	create: function* () {
		// vytvoreni jednotlivych stavu
		var gretingState =
			vxml.State.create('greeting', new vxml.Say('Welcome to menu example.'));

		var optionOneState =
			vxml.State.create('optionOne', new vxml.Exit('You selected option one.'));

		var optionTwoState =
			vxml.State.create('optionTwo', new vxml.Exit('You selected option two.'));

		var optionThreeState =
			vxml.State.create('optionThree', new vxml.Exit('You selected option three.'));

		var invalidSelectionState =
			vxml.State.create('invalidSelection', new vxml.Exit('You selected an invalid option.'));

		var menuState =
			vxml.State.create('menu', new vxml.Ask({
				prompt: [
					'Press one, two or three.',
					'huhuhu'
				],
				grammar: new vxml.BuiltinGrammar({
					type: 'digits',
					length: 1
				})
			}))
			.addOnEntryAction(function* () {
				console.log('You\'ve entered menu vxml.State.');
			})
			.addOnExitAction(function* () {
				console.log('You\'ve leaved menu vxml.State.');
			})
			.addTransition('continue', optionOneState, function (result) {
				return result == 1;
			})
			.addTransition('continue', optionTwoState, function (result) {
				return result == 2;
			})
			.addTransition('continue', optionThreeState, function (result) {
				return result == 3;
			})
			.addTransition('continue', invalidSelectionState, function (result) {
				return [1, 2, 3].indexOf(result) == -1;
			});

		gretingState.addTransition('continue', menuState);

		// registrace stavu do kontejneru
		this
			.addState(gretingState)
			.addState(menuState)
			.addState(optionOneState)
			.addState(optionTwoState)
			.addState(optionThreeState)
			.addState(invalidSelectionState);
	}
});


module.exports = MenuExampleCtrl;
