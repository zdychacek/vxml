'use strict';

var vxml = require('../../index'),
	DynamicMenuService = require('./DynamicMenuService');

var DynamicMenuCtrl = vxml.CallFlow.extend({
	constructor: function () {
		DynamicMenuCtrl.super.call(this);
	},

	create: function* () {
		this.addState(vxml.State.create('greeting', new vxml.Say('Welcome to the dynamic menu example.'), 'myMenu'), true);

		// This is a fake service that mimics getting meta-data for the menus from a web service or database
		var myMenu = DynamicMenuService.getMenu('myMenu'),
			menuOptions = new vxml.Prompt();

		// Create the initial state and view model without any transitions
		var myMenuState = vxml.State.create('myMenu', new vxml.Ask({
			prompt: menuOptions,
			grammar: new vxml.BuiltinGrammar({
				type: 'digits',
				length: 1
			})
		}));

		// Build the prompts for the menu options form the meta-data
		myMenu.options.forEach(function (option) {
			menuOptions.audios.push(
				new vxml.TtsMessage(option.promptMsg + DynamicMenuService.getSelectionPrompt(option.number))
			);

			// Add the transitions to the state
			myMenuState.addTransition('continue', option.transitionTarget, function (result) {
				return result == option.number;
			});
		});

		// Add the state to the call this
		this.addState(myMenuState);

		this.addState(
			vxml.State.create('doThis', new vxml.Exit('You selected to do this. Goodbye.'))
		);

		this.addState(
			vxml.State.create('doThat', new vxml.Exit('You selected to do that. Goodbye.'))
		);

		this.addState(
			vxml.State.create('doWhatever', new vxml.Exit('You selected to do whatever. Goodbye.'))
		);

		this.addState(
			vxml.State.create('invalidSelect', new vxml.Exit('That was an invalid selection. Goodbye.'))
		);
	}
});

module.exports = DynamicMenuCtrl;
