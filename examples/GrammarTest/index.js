'use strict';

var vxml = require('../../index');

var GrammarTest = vxml.CallFlow.extend({

	constructor: function () {
		GrammarTest.super.call(this);
	},

	create: function* () {
		var choices = new vxml.Choices([
			{
				items: [ 'yep', 'yeah', 'ya', 'yes', 'dtmf-1', 'dtmf-2', 'dtmf-3', 'dtmf-*' ],
				tag: 'yes'
			},
			{
				items: [ 'nope', 'nuh', 'dtmf-4', 'dtmf-#' ],
				tag: 'no'
			},
			'maybe'
		]);

		// vxml.Grammar([ 'yes', 'no' ]);

		var askModel = new vxml.Ask({
			prompt: 'Ask something?',
			choices: choices
		});

		var askState = vxml.State.create('ask', askModel);

		this.addState(askState);
	}
});

module.exports = GrammarTest;
