'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Prompt = require('./Prompt');

var Say = VoiceModel.extend({
	constructor: function (optionsOrPrompt /* id, prompt, properties */) {
		var options = optionsOrPrompt;

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt || Array.isArray(optionsOrPrompt)) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'output';

		Say.super.call(this, options);
	}
});

module.exports = Say;
