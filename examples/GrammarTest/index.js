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

		var askModel = new vxml.Ask({
			prompt: 'Ask something?',
			grammar: choices
		});

		this.addState(
			vxml.State.create('ask', askModel)
				.addOnExitAction(function* (cf, state, event) {
					console.log(JSON.stringify(event));
				})
		);
	}
});

module.exports = GrammarTest;
