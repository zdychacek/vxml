'use strict';

var Class = require('class');

var BuiltinGrammar = Class.extend({
	
	constructor: function (options /* type, length, minLength, maxLength */) {
		options || (options = {});

		// boolean, date, digits, currency, number, phone, time
		this.type = options.type;
		this.length = options.length;
		this.minLength = options.minLength;
		this.maxLength = options.maxLength;
	},

	toXml: function () {
		var sgrammar = this.type;

		if (this.type == 'digits') {
			if (this.length > 0) {
				sgrammar += '?length=' + this.length;
			}
			else {
				if (this.minLength > 0) {
					if (this.maxLength > 0) {
						sgrammar += '?minlength=' + this.minLength + ';maxlength=' + this.maxLength;
					}
					else {
						sgrammar += '?minlength=' + this.minLength;
					}
				}
				else {
					if (this.maxLength > 0) {
						sgrammar += '?maxlength=' + this.maxLength;
					}
				}
			}
		}

		return sgrammar;
	}
});

module.exports = BuiltinGrammar;
