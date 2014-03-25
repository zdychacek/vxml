'use strict';

var Prompt = require('./Prompt'),
	Grammar = require('./Grammar'),
	BuiltinGrammar = require('./BuiltinGrammar'),
	VoiceModel = require('./core/VoiceModel');

var Ask = VoiceModel.extend({

	constructor: function (optionsOrPrompt /* id, grammar, prompt, noInputPrompts, noMatchPrompts */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt || Array.isArray(optionsOrPrompt)) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'input';

		// super call
		Ask.super.call(this, options);

		this.grammar = options.grammar;
		this.noInputPrompts = options.noInputPrompts || [];
		this.noMatchPrompts = options.noMatchPrompts || [];
	}
});

module.exports = Ask;
