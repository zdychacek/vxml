'use strict';

var jade = require('jade'),
	fs = require('fs'),
	path = require('path'),
	Helpers = require('./Helpers'),
	viewsPath = path.join(__dirname, '../views'),
	options = {
		pretty: true
	},
	DEBUG = true;

var VoiceViewEngine = {

	renderView: function (viewName, voiceModel, rootView) {
		var data = Helpers.merge({}, voiceModel, {
			pretty: true,
			renderView: VoiceViewEngine.renderView,
			// helpers
			PromptHelper: require('../PromptHelper')
		});

		var output = jade.renderFile(path.join(viewsPath, viewName + '.jade'), data);

		// ladici vystup
		if (DEBUG && rootView) {
			var ts = new Date().toJSON().replace(/\:/g, '-');
			fs.writeFileSync('/tmp/vxml/output_' + ts + '.xml', output);
		}

		return output;
	}
};

module.exports = VoiceViewEngine;
