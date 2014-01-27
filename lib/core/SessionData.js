'use strict';

var Class = require('class');

var SessionData = Class.extend({
	constructor: function () {
		this._sessions = {};
	},

	set: function (data, sessionId) {
		this._sessions[sessionId] = data;
	},

	get: function (sessionId) {
		if (!sessionId) {
			throw new Error('Missing session id!');
		}

		var data = this._sessions[sessionId];

		return data;
	}
});

module.exports = SessionData;
