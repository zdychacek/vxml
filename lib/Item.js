'use strict';

var Class = require('class');

var Item = Class.extend({
	
	constructor: function (text, tag) {
		this.text = text;
		this.tag = tag;
	},

	toXml: function () {
		var buffer = ['<item>'];

		buffer.push(this.text);

		if (this.tag) {
			buffer.push('<tag>out="' + this.tag +'"</tag>');	
		}
		buffer.push('</item>');

		return buffer.join('');
	}
});

module.exports = Item;
