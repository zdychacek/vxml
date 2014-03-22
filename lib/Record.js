'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Silence = require('./Silence'),
	Prompt = require('./Prompt');

var Record = VoiceModel.extend({
	constructor: function (optionsOrPrompt /* id, prompt, beep, finalsilence, type, properties */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt || Array.isArray(optionsOrPrompt)) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'record';

		// zavolani konstruktoru predka
		Record.super.call(this, options);

		this.maxtime = 60;
		this.beep = (typeof options.beep !== 'undefined'? options.beep : true);
		this.finalsilence = options.finalsilence || '2500ms';
		this.type = options.type || 'audio/wav';
	}
});

module.exports = Record;
