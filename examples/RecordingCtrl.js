'use strict';

var fs = require('fs'),
	path = require('path'),
	vxml = require('../index');

var RecordingCtrl = vxml.CallFlow.extend({
	constructor: function () {
		RecordingCtrl.super.call(this);
	},

	create: function* () {
		//Make the first recording and playback
		this.addState(
			vxml.State.create('getRecording', new vxml.Record('Please record your information after the beep.'), 'playback')
			.addOnExitAction(function* (cf, state, event) {
				cf.recordingUrl = event.data;
			}));

		var playbackPrompt = new vxml.Prompt('You recorded ');
		playbackPrompt.audios.push(
			new vxml.Audio(new vxml.Var(this, 'recordingUrl'), 'Error finding recording')
		);

		this.addState(
			vxml.State.create('playback', new vxml.Say(playbackPrompt), 'saveOrDelete')
		);

		this.addState(
			vxml.State.create('saveOrDelete', new vxml.Ask(
				new vxml.Prompt({
					text: 'Do you want to save your message?',
					bargein: false
				}),
				['yes', 'no']
			))
			.addTransition('noinput', 'saveOrDelete')
			.addTransition('nomatch', 'saveOrDelete')
			.addTransition('continue', 'messageSaved', function (result) {
				return result == 'yes';
			})
			.addTransition('continue', 'messageDeleted', function (result) {
				return result == 'no';
			})
		);

		this.addState(
			vxml.State.create('messageDeleted', new vxml.Exit('Your message has been deleted. Goodbye.'))
			.addOnEntryAction(function* (cf, state, event) {
				var filePath = path.join(process.cwd(), cf.recordingUrl);

				fs.unlinkSync(filePath);
			})
		);

		this.addState(
			vxml.State.create('messageSaved', new vxml.Exit('Your message has been saved. Goodbye.'))
		);
	}
});

module.exports = RecordingCtrl;
