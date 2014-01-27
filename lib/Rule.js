'use strict';

var Class = require('class');

var Rule = Class.extend({
	constructor: function (id) {
		this.id = id || '';
		this.oneOfList = [];
	},
	
	getScope: function () {
		if (this.scope == 'isPrivate') {
			return 'private';
		}
		else {
			return 'public';
		}
	},

	toXml: function () {
		var buffer = ['<rule'],
			attrs = [];

		if (this.id) {
			attrs.push('id="' + this.id + '"');
		}

		attrs.push('scope="' + this.getScope() + '"');
		buffer.push(' ' + attrs.join(' ') + '>');

		buffer.push('<one-of>');

		this.oneOfList.forEach(function (item) {
			buffer.push(item.toXml());
		});

		buffer.push('</one-of>');
		buffer.push('</rule>');

		return buffer.join('');
	}
});

module.exports = Rule;
