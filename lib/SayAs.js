'use strict';

var Class = require('class'),
	Var = require('./core/Var');

var SayAs = Class.extend({

	constructor: function (message, interpretAs) {
		this.message = message;
		this.interpretAs = interpretAs;
	},

	render: function () {
		var msg = this.message;

		if (this.message instanceof Var) {
			msg = this.message.render();
		}

		return '<say-as interpret-as="' + this.interpretAs + '">' + this.message + '</say-as>';
	}
});

module.exports = SayAs;
