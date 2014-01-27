'use strict';

var Class = require('class');

// TODO: rekurzivni zanoreni
var Item = Class.extend({
	constructor: function (utterance) {
		this.utterance = utterance;
	},

	toXml: function () {
		var buffer = ['<item>'];

		buffer.push(this.utterance);
		buffer.push('</item>');

		return buffer.join('');
	}
});

module.exports = Item;
