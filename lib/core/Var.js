'use strict';

var Class = require('class');

var Var = Class.extend({
	constructor: function (context, name, suffix) {
		this._ctx = context;
		this.name = name;
		this.suffix = (suffix && suffix.toString()) || '';
	},

	_parseValue: function () {
		var parts = this.name.split('.'),
			value = this._ctx;

		for (var i = 0, l = parts.length; i < l; i++) {
			var currValue = value[parts[i]];

			if (typeof currValue === 'undefined') {
				return 'value is not defined';
			}

			value = currValue;
		}

		return value;
	},

	render: function () {
		var value = this._parseValue().toString();

		return value + this.suffix;
	},

	getValue: function () {
		return this._parseValue();
	},

	toString: function () {
		return this.render();
	}
});

module.exports = Var;
