'use strict';

var Class = require('class');

var Silence = Class.extend({

	constructor: function (pause) {
		this._time = null;
		this._strength = null;

		this.setPause(pause);
	},

	setPause: function (pause) {
		// if 'pause' is valid input for 'time' attribute than set it
		if (typeof pause === 'number' || /\d+(ms|s)?$/.test(pause)) {
			this._time = pause;
		}
		// ...else handle it like 'strength' attribute value
		else {
			// none|x-weak|weak|medium|strong|x-strong
			this._strength = pause;
		}
	},

	render: function () {
		var xml = ['<break'];

		if (this._strength) {
			xml.push(' strength="' + this._strength + '"');
		}
		else if (this._time) {
			xml.push(' time="' + this._time + '"');
		}

		xml.push('/>');

		return xml.join('');
	}
});

module.exports = Silence;
