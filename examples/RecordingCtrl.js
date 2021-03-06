'use strict';

var fs = require('fs'),
	Q = require('q'),
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
				var bufferData = event.data,
					fileName = (+new Date()) + '.wav',
					absolutePath = __dirname + '/static/recordings/' + fileName;

				yield Q.nfapply(fs.writeFile, [ absolutePath, bufferData ]);

				cf.recordingUrl = '/static/recordings/' + fileName;
			}));

		var playbackPrompt = new vxml.Prompt([
			'You recorded ',
			new vxml.Audio(new vxml.Var(this, 'recordingUrl'), 'Error finding recording')
		]);

		this.addState(
			vxml.State.create('playback', new vxml.Say(playbackPrompt), 'saveOrDelete')
		);

		this.addState(
			vxml.State.create('saveOrDelete', new vxml.Ask({
				prompt: new vxml.Prompt({
					text: 'Do you want to save your message?',
					bargein: false
				}),
				grammar: new vxml.Choices([
				{
					tag: 'yes',
					items: [ 'yes', 'dtmf-1' ]
				},
				{
					tag: 'no',
					items: [ 'no', 'dtmf-2' ]
				}])
			}))
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
				fs.unlinkSync(__dirname + cf.recordingUrl);
			})
		);

		this.addState(
			vxml.State.create('messageSaved', new vxml.Exit('Your message has been saved. Goodbye.'))
		);
	}
});

module.exports = RecordingCtrl;
