'use strict';

var vxml = require('../index');

var OptionsCtrl = vxml.CallFlow.extend({
	constructor: function () {
		OptionsCtrl.super.call(this);
	},

	create: function* () {
		var mainMenuState = vxml.State.create('mainMenu', new vxml.Ask({
			prompt: 'Press one for option one. Press two for option two.',
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 1
			})
		}));

		mainMenuState.addTransition('continue', 'optionOne', function (result) {
			return result == 1;
		});

		mainMenuState.addTransition('continue', 'optionTwo', function (result) {
			return result == 2;
		});

		mainMenuState.addTransition('continue', 'invalidSelect', function (result) {
			return result != 1 && result != 2;
		});

		this.addState(mainMenuState, true);

		this.addState(
			vxml.State.create('optionOne', new vxml.Exit('You selected option one. Goodbye.')
		));

		this.addState(
			vxml.State.create('optionTwo', new vxml.Exit('You selected option two. Goodbye.')
		));

		this.addState(
			vxml.State.create('invalidSelect', new vxml.Exit('That was an invalid selection. Goodbye.')
		));
	}
});

module.exports = OptionsCtrl;
