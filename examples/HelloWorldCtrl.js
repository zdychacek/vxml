'use strict';

var vxml = require('../index');

var HelloWorldCtrl = vxml.CallFlow.extend({
	constructor: function () {
		HelloWorldCtrl.super.call(this);
	},

	create: function* () {
		this.addState(
			vxml.State.create('greeting', new vxml.Exit('Hello World')
		));
	}
});

module.exports = HelloWorldCtrl;
