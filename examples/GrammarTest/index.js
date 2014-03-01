'use strict';

var vxml = require('../../index');

var GrammarTest = vxml.CallFlow.extend({

	constructor: function () {
		GrammarTest.super.call(this);
	},

	create: function* () {
		var choices = new vxml.Choices([
			'yes',
			'no',
			'maybe'
		]);

		// vxml.Grammar([ 'yes', 'no' ]);

		var askModel = new vxml.Ask({
			prompt: 'Ask something?',
			grammar: choices
		});

		var askState = vxml.State.create('ask', askModel);
		askState.addOnExitAction(function* (cf, state, event) {
			console.log(JSON.stringify(event));
		});

		this.addState(askState);
	}
});

module.exports = GrammarTest;
