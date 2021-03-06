'use strict';

var vxml = require('../index'),
	Helpers = require('./Helpers');

var VoiceMenuCtrl = vxml.CallFlow.extend({

	constructor: function () {
		this.services = [];

		VoiceMenuCtrl.super.call(this);
	},

	create: function* () {
		yield Helpers.delay(1000);

		this.addState(
			vxml.State.create('greeting', new vxml.Say('Hello. This is Mayhem.'), 'assist'));

		var assistNoinput = new vxml.Prompt('I could not hear you. Please let me know what you want me to do.'),
			assistNoinputs = [ assistNoinput, assistNoinput ],
			assistNomatch = new vxml.Prompt('I could not understand you. Please let me know what you want me to do.'),
			assistNomatches = [ assistNomatch, assistNomatch ];

		this.addState(
			vxml.State.create('assist', new vxml.Ask({
				prompt: new vxml.Prompt('How may I assist you?'),
				grammar: new vxml.Choices([ 'list', 'detail' ]),
				noInputPrompts: assistNoinputs,
				noMatchPrompts: assistNomatches
			}), 'queueCommand')
			.addTransition('nomatch', 'didNotUnderstand')
			.addTransition('noinput', 'didNotUnderstand')
		);

		this.addState(
			vxml.State.create('didNotUnderstand', new vxml.Say('I did not understand your request.'), 'goodbye')
		);

		this.addState(
			new vxml.State('queueCommand', 'commandSent')
				.addTransition('error', 'errSendingCommand')
				.addOnEntryAction(function* (cf, state, event) {
					var err = null;

					try {
						cf.services.push(event.data);
						yield cf.fireEvent('continue');
					}
					catch (ex) {
						// NOTE: jshint problem
						err = ex;
					}

					if (err) {
						yield cf.fireEvent('error');
					}
				})
		);

		this.addState(
			vxml.State.create('commandSent', new vxml.Say('Your request has been sent.'), 'doMore')
		);

		this.addState(
			vxml.State.create('errSendingCommand', new vxml.Say('There was an error sending your request.'), 'doMore')
		);

		var doMoreNoinput = new vxml.Prompt('I could not hear you. Let me know if I can assist with anything else by saying yes or no.'),
			doMoreNoinputs = [ assistNoinput, assistNoinput ],
			doMoreNomatch = new vxml.Prompt('I could not understand you. Let me know if I can assist with anything else by saying yes or no.'),
			doMoreNomatches = [ doMoreNomatch, doMoreNomatch ];

		this.addState(
			vxml.State.create('doMore', new vxml.Ask({
				prompt: 'May I assist you with anything else?',
				grammar: new vxml.Choices(['yes', 'no']),
				noInputPrompts: doMoreNoinputs,
				noMatchPrompts: doMoreNomatches
			}))
			.addTransition('continue', 'goodbye', function (result) {
				return result == 'no';
			})
			.addTransition('continue', 'assist', function (result) {
				return result == 'yes';
			})
			.addTransition('nomatch', 'goodbye')
			.addTransition('noinput', 'goodbye')
		);

		this.addState(
			vxml.State.create('goodbye', new vxml.Exit('Thank you for using Mayhem. Goodbye'))
			.addOnEntryAction(function* (cf, state, event) {
				console.log('Selected services:', cf.services);
			})
		);
	}
});

module.exports = VoiceMenuCtrl;
