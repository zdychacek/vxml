'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Prompt = require('./Prompt');

var Exit = VoiceModel.extend({
	constructor: function (optionsOrPrompt /* id, prompt, properties */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'exit';

		// super call
		Exit.super.call(this, options);

		this.exitPrompt = [];	// of Prompt

		if (options.prompt) {
			if (options.prompt instanceof Prompt) {
				this.exitPrompt.push(options.prompt);
			}
			else {
				this.exitPrompt.push(new Prompt({
					text: options.prompt
				}));
			}
		}
	}
});

module.exports = Exit;
