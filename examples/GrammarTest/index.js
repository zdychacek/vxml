'use strict';

var vxml = require('../../index');

var GrammarTest = vxml.CallFlow.extend({

	constructor: function () {
		GrammarTest.super.call(this);
	},

	create: function* () {
		var choices = new vxml.Choices([
			{
				items: ['yes', 'ya', 'dtmf-1', 'dtmf-*'],
				tag: 'yes'
			},
			{
				items: ['no', 'nope', 'dtmf-2', 'dtmf-#'],
				tag: 'no'
			},
			'maybe'
		]);

		var repeatModel = new vxml.Exit(new vxml.Prompt([
			'You have entered ',
			new vxml.Var(this, 'input'),
			new vxml.Silence('weak')
		]));
		var repeatState = vxml.State.create('repeat', repeatModel);

		var askModel = new vxml.Ask({
			prompt: 'Enter yes or no.',
			grammar: choices
		});
		var askState = vxml.State.create('ask', askModel, repeatState)
			.addOnExitAction(function* (cf, state, event) {
				cf.input = event.data;
			});

		this.addState(askState);
		this.addState(repeatState);
	}
});

module.exports = GrammarTest;
