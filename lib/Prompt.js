'use strict';

var Class = require('class');

var Prompt = Class.extend({

	constructor: function (optionsOrTextOrAudios /* text, audios, bargein, bargeinType, timeout, language */) {
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

		this.count = options.count;
		this.timeout = (typeof options.timeout !== 'undefined')? options.timeout : 0;
		// speech, hotword, none
		this.bargeinType = options.bargeinType;
		this.bargein = (typeof options.bargein !== 'undefined'? options.bargein : true);
		this.language = options.language || '';
		this.audios = [];

		if (options.text) {
			this.audios.push(options.text);
		}

		if (options.audios) {
			Array.prototype.push.apply(this.audios, options.audios);
		}
	},

	addAudio: function (audio) {
		this.audios.push(audio);
	}
});

module.exports = Prompt;
