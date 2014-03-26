'use strict';

var VoiceModel = require('./core/VoiceModel'),
	Silence = require('./Silence'),
	Prompt = require('./Prompt');

var Record = VoiceModel.extend({

	constructor: function (optionsOrPrompt /* id, prompt, maxTime, beep, finalSilence, type, properties */) {
		var options = optionsOrPrompt || {};

		if (typeof optionsOrPrompt === 'string' || optionsOrPrompt instanceof Prompt || Array.isArray(optionsOrPrompt)) {
			options = {
				prompt: optionsOrPrompt
			};
		}

		options.viewName = 'record';

		// zavolani konstruktoru predka
		Record.super.call(this, options);

		this.maxTime = options.maxTime || 60;	// seconds
		this.beep = (typeof options.beep !== 'undefined'? options.beep : true);
		this.finalSilence = options.finalSilence || 2500; // miliseconds
		this.type = options.type || 'audio/wav';
	}
});

module.exports = Record;
