'use strict';

var Class = require('class'),
	Var = require('./core/Var');

// TODO: Atributy fetchhint, fetchtimeout
/* jshint -W079 */
var Audio = Class.extend({
	constructor: function (src, message) {
		this.message = message || '';
		this.src = src;
	},

	getSrc: function () {
		if (this.src instanceof Var) {
			return this.src.render();
		}
		else {
			return this.src;
		}
	},

	render: function () {
		return [
			'<audio src="',
			this.getSrc(),
			'">',
			this.message,
			'</audio>'
		].join('');
	}
});

module.exports = Audio;
