'use strict';

var Prompt = require('./Prompt'),
	Grammar = require('./Grammar'),
	BuiltinGrammar = require('./BuiltinGrammar'),
	VoiceModel = require('./core/VoiceModel');

var Ask = VoiceModel.extend({

	constructor: function (optionsOrPrompt /* id, grammar, prompt, noinputPrompts, nomatchPrompts */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'input';

		// super call
		Ask.super.call(this, options);

		this.grammar = options.grammar;
		this.initialPrompt = [];
		this.noinputPrompts = options.noinputPrompts || [];
		this.nomatchPrompts = options.nomatchPrompts || [];

		if (options.prompt) {
			if (options.prompt instanceof Prompt) {
				this.initialPrompt.push(options.prompt);
			}
			else {
				this.initialPrompt.push(new Prompt({
					text: options.prompt
				}));
			}
		}
	}
});

module.exports = Ask;
