'use strict';

var Class = require('class'),
	co = require('co'),
	Q = require('q');

var Actions = Class.extend({
	constructor: function () {
		this._actionList = [];
	},

	add: function (action) {
		if (action.constructor.name !== 'GeneratorFunction') {
			throw new Error('You can add only generator function.');
		}

		this._actionList.push(action);
	},

	execute: function (cf, state, eventType, data) {
		var results = [],
			self = this,
			deferred = Q.defer(),
			eventObj = {
				type: eventType,
				data: data
			};

		co(function* () {
			var actions = [];

			for (var i = 0, l = this._actionList.length; i < l; i++) {
				var action = this._actionList[i];

				try {
					// call that action in state context
					yield action.call(state, cf, state, eventObj);
				}
				catch (ex) {
					deferred.reject(ex);
				}
			}
		}).call(this, function () {
			deferred.resolve(eventObj)
		});

		return deferred.promise;
	}
});

module.exports = Actions;
