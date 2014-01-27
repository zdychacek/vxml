'use strict';

var Class = require('class');

var VoiceModel = Class.extend({
	constructor: function (options /* id, appName, next, properties, submitMethod */) {
		options || (options = {});

		this.id = options.id;
		this.appName = options.appName;
		this.viewName = options.viewName;
		this.nextUri = options.nextUri;
		this.submitMethod = options.submitMethod || 'get';
		this.properties = options.properties || {};
	},

	addProperty: function (name, value) {
		this.properties[name] = value;
	}
});

module.exports = VoiceModel;
