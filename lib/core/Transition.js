'use strict';

var Class = require('class');

var Transition = Class.extend({
	constructor: function (options /* event, target, condition */) {
		options || (options = {});

		this.event = options.event;
		this.target = options.target;
		this.condition = null;

		if (typeof options.condition === 'function') {
			this.condition = options.condition;
		}
	}
});

module.exports = Transition;
