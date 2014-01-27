'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Prompt = require('./Prompt');

var Say = VoiceModel.extend({
	constructor: function (optionsOrPrompt /* id, prompt, properties */) {
		var options = optionsOrPrompt;

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'output';

		// zavolani konstruktoru predka
		Say.super.call(this, options);

		this.prompts = [];

		if (options.prompt) {
			if (options.prompt instanceof Prompt) {
				this.prompts.push(options.prompt);
			}
			else {
				this.prompts.push(new Prompt({
					text: options.prompt
				}));
			}
		}
	}
});

module.exports = Say;
