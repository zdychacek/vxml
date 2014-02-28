'use strict';

var Prompt = require('./Prompt'),
	Grammar = require('./Grammar'),
	BuiltinGrammar = require('./BuiltinGrammar'),
	VoiceModel = require('./core/VoiceModel');

var Ask = VoiceModel.extend({

	constructor: function (optionsOrPrompt /* id, grammar, prompt, noinputPrompts, nomatchPrompts */, answers) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		if (Array.isArray(answers)) {
			options.answers = answers;
		}

		options.viewName = 'input';

		// super call
		Ask.super.call(this, options);

		var grammar = null;

		if (options.grammar) {
			if (options.grammar instanceof BuiltinGrammar) {
				grammar = new Grammar({
					builtinGrammar: options.grammar
				});
			}
			else {
				grammar = options.grammar;
			}
		}
		// shortcut
		else if (Array.isArray(options.answers)) {
			grammar = new Grammar({
				id: 'G_1',
				utterances: options.answers
			});
		}

		this.grammar = grammar;
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
