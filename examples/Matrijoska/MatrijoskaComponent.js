'use strict';

var Helpers = require('../Helpers'),
	vxml = require('../../index');

var MatrijoskaComponent = vxml.CallFlow.extend({
	constructor: function (promptMsg, ticketId) {
		MatrijoskaComponent.super.call(this);

		this.ticketId = ticketId;
		this.promptMsg = promptMsg;
	},

	create: function* () {
		// async op
		yield Helpers.delay(500);

		// TODO: get some data here and build callflow accordingly
		//console.log(this.ticketId.toString());

		var prompt = new vxml.Prompt();

		prompt.audios = [
			new vxml.TtsMessage(this.promptMsg),
			new vxml.Var(this, 'ticketId')
		];

		this.addState(vxml.State.create('say', new vxml.Say(prompt), 'showTicketAgain'));

		this.addState(
			new vxml.State('showTicketAgain')
				.addNestedCallFlow(
					new MatrijoskaComponent('Again: ticket ID is ', this.ticketId.toString())
				)
		);
	}
});

module.exports = MatrijoskaComponent;
