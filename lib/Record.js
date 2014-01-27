'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Silence = require('./Silence'),
	Prompt = require('./Prompt');

var Record = VoiceModel.extend({
	constructor: function (optionsOrPrompt /* id, prompt, beep, finalsilence, type, properties */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'record';

		// zavolani konstruktoru predka
		Record.super.call(this, options);

		this.prompts = [];
		this.maxtime = 60;
		this.beep = (typeof options.beep !== 'undefined'? options.beep : true);
		this.finalsilence = options.finalsilence || '2500ms';
		this.type = options.type || 'audio/wav';

		if (options.prompt instanceof Prompt) {
			this.prompts.push(options.prompt);
		}
		else {
			this.prompts.push(new Prompt({
				text: options.prompt,
				bargein: false
			}));	
		}
	}
});

module.exports = Record;
