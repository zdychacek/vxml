'use strict';

var Class = require('class'),
	Prompt = require('../Prompt');

var VoiceModel = Class.extend({
	constructor: function (options /* id, appName, next, properties, submitMethod, prompt */) {
		options || (options = {});

		this.id = options.id;
		this.appName = options.appName;
		this.viewName = options.viewName;
		this.nextUri = options.nextUri;
		this.submitMethod = options.submitMethod || 'get';
		this.properties = options.properties || {};
		this.prompts = [];	// of Prompt

		this.addPrompt(options.prompt);
	},

	addProperty: function (name, value) {
		this.properties[name] = value;
	},

	addPrompt: function (prompts) {
		if (!Array.isArray(prompts)) {
			prompts = [ prompts ];
		}

		prompts.forEach(function (prompt) {
			if (prompt instanceof Prompt) {
				this.prompts.push(prompt);
			}
			else {
				this.prompts.push(new Prompt({
					text: prompt
				}));
			}
		}, this);
	}
});

module.exports = VoiceModel;
