'use strict';

var vxml = require('../../index'),
	Helpers = require('../Helpers'),
	MatrijoskaComponent = require('./MatrijoskaComponent');

var MatrijoskaCtrl = vxml.CallFlow.extend({
	constructor: function () {
		MatrijoskaCtrl.super.call(this);
	},

	create: function* () {
		// async op
		yield Helpers.delay(500);

		this.addState(
			vxml.State.create('getId', new vxml.Say('Enter the ticket\'s id you want to show'), 'showTicket')
			.addOnExitAction(function* (cf, state, event) {
				cf.ticketId = event.data;
			})
		);

		this.addState(
			new vxml.State('showTicket', 'goodbye')
				.addNestedCallFlow(
					new MatrijoskaComponent('Ticket ID is ', new vxml.Var(this, 'ticketId'))
				)
		);

		this.addState(
			vxml.State.create('goodbye', new vxml.Exit('Goodbye.'))
		);
	}
});

module.exports = MatrijoskaCtrl;
