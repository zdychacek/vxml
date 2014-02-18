'use strict';

var Class = require('class');

var Var = Class.extend({
	constructor: function (context, nameOrFn, suffix) {
		this._ctx = context;
		this.nameOrFn = nameOrFn;
		this.suffix = (suffix && suffix.toString()) || '';
	},

	_parseValue: function () {
		var value = null;

		if (typeof this.nameOrFn === 'string') {
			var parts = this.nameOrFn.split('.'),
				value = this._ctx;

			for (var i = 0, l = parts.length; i < l; i++) {
				var currValue = value[parts[i]];

				if (typeof currValue === 'undefined') {
					return 'value is not defined';
				}

				value = currValue;
			}
		}
		else if (typeof this.nameOrFn === 'function') {
			try {
				value = this.nameOrFn.call(this._ctx);
			}
			catch (ex) {
				console.log('Var#_parseValue: Error while evaluating function expression.');
			}
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
