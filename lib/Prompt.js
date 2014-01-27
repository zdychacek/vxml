'use strict';

var Class = require('class'),
	TtsMessage = require('./TtsMessage');

var Prompt = Class.extend({
	constructor: function (optionsOrText /* text, audio, bargein */) {
		var options = optionsOrText || {};

		if (typeof optionsOrText === 'string') {
			options = {
				text: optionsOrText
			};
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

		if (options.audio) {
			this.audios.push(options.audio);
		}
	}
});

module.exports = Prompt;
