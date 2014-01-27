'use strict';

var Class = require('class'),
	Var = require('./core/Var');

var TtsMessage = Class.extend({
	constructor: function (message) {
		this.message = message;
	},

	render: function () {
		if (this.message instanceof Var) {
			return this.message.render();
		}
		else {
			return this.message;
		}
	}
});

module.exports = TtsMessage;
