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
	}
});

module.exports = BuiltinGrammar;
