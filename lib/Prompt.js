'use strict';

var Class = require('class'),
	TtsMessage = require('./TtsMessage');

var Prompt = Class.extend({

	constructor: function (optionsOrTextOrAudios /* text, audio, bargein */) {
		var options = {};

		if (typeof optionsOrTextOrAudios === 'string') {
			options.text = optionsOrTextOrAudios;
		}
		else if (Array.isArray(optionsOrTextOrAudios)) {
			options.audios = optionsOrTextOrAudios;
		}
		else if (optionsOrTextOrAudios) {
			options = optionsOrTextOrAudios;
		}

		this.count = 0;
		this.timeout = 0;
		// sppech, hotword, none
		this.bargeintype = 'none';
		this.bargein = (typeof options.bargein !== 'undefined'? options.bargein : true);
		this.language = '';
		this.audios = [];

		if (options.text) {
			this.audios.push(new TtsMessage(options.text));
		}

		if (options.audios) {
			Array.prototype.push.apply(this.audios, options.audios);
		}
	}
});

module.exports = Prompt;
