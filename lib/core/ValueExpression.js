'use strict';

var Class = require('class');

var ValueExpression = Class.extend({
	constructor: function (name) {
		this.name = name;
	},

	render: function () {
		return '<value expr="' + this.name + '\"/>';
	}
});

module.exports = ValueExpression;
