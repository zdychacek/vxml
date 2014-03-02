'use strict';

var Class = require('class'),
	Helpers = require('./Helpers'),
	fs = require('fs'),
	path = require('path'),
	Q = require('q'),
	SessionData = require('./SessionData'),
	VoiceViewEngine = require('./VoiceViewEngine'),
	CallFlow = require('./CallFlow');

Q.longStackSupport = true;

var Application = Class.extend({
	constructor: function (options /* server, route, controller, fetchtimeout */) {
		options || (options = {});

		if (!options.server) {
			throw new Error('Application#ctor: You must provide Express application instance.');
		}

		if (typeof options.controller !== 'function') {
			throw new Error('Application#ctor: You must provide controller constructor function.');
		}

		if (!options.route) {
			throw new Error('Application#ctor: You must provide route for application.');
		}

		console.log('Creating application on URL:', options.route);

		this.route = options.route;
		this.server = options.server;
		this.controller = options.controller;
		this._sessions = new SessionData();

		// mergnutí konfigurace
		this.config = Helpers.merge({}, this.constructor.defaultConfig, options.config);

		// nabindovani rout
		this.bindRoutes();
	},

	statics: {
		defaultConfig: {
			stateMachineHandlerURL: 'stateMachine',
			recordingHandlerURL: 'saveRecording',
			// timeout na stazeni vxml souboru
			fetchTimeout: 20
		},

		create: function (options /* server, route, controller, config */) {
			return new this(options);
		}
	},

	getVxmlUri: function () {
		return this.route + '/' + this.config.stateMachineHandlerURL;
	},

	getVxmlRecordingUri: function () {
		return this.route + '/' + this.config.recordingHandlerURL;
	},

	getCallFlowBySessionId: function (sessionId) {
		var callFlow = this._sessions.get(sessionId);

		// vytvoreni nove instance controlleru a ulozeni instance do pameti
		if (callFlow) {
			return callFlow;
		}
		else {
			callFlow = new this.controller(this);

			callFlow.$sessionId = sessionId;
			this._sessions.set(callFlow, sessionId);
			console.log('Saving new callflow:', sessionId);
		}

		return callFlow;
	},

	_fireEvent: function (event, result, sessionId) {
		var app = this;

		// 1. na zaklade sessionId ziskam instanci callflow
		var cf = this.getCallFlowBySessionId(sessionId);

		return cf.fireEvent(event, result)
			.then(function () {
				var currState = cf.getCurrState();

				if (!currState) {
					throw new Error('Application#stateMachineHandler: Current state doesn\'t exist. Check if at least one state is specified.');
				}

				if (!currState.voiceModel) return;

				var voiceModel = currState.voiceModel;

				voiceModel.sessionid = sessionId;

				// nastaveni dalsi URL
				if (voiceModel.viewName == 'record') {
					voiceModel.nextUri = app.getVxmlRecordingUri();
				}
				else {
					voiceModel.nextUri = app.getVxmlUri();
				}

				// pokud je nastaven timeout na stazenni dat
				if (app.config.fetchTimeout) {
					var timeout = app.config.fetchTimeout;

					// pokud jsem zadal cislo, tak udaj beru ve vterinach
					if (typeof timeout === 'number') {
						timeout += 's';
					}

					voiceModel.addProperty('fetchtimeout', timeout);
				}

				return voiceModel;
			});
	},

	stateMachineHandler: function (req, res, next) {
		var event = req.query.event,
			result = req.query.result,
			sessionId = req.query.sessionid;

		if (!sessionId) {
			sessionId = req.query['session.sessionid'];
		}

		this._fireEvent(event, result, sessionId)
			.then(function (voiceModel) {
				res.send(
					VoiceViewEngine.renderView(voiceModel.viewName, voiceModel, true)
				);
			})
			.fail(function (err) {
				next(new Error(err));
			});
	},

	saveRecordingHandler: function (req, res, next) {
		var callersMessage = req.files.callersMessage,
			app = this,
			event = req.query.event,
			sessionId = req.query.sessionid;

		if (callersMessage) {
			/* 1. ulozim soubor s nahravkou
			 * 2. vygeneruji view
			 * 3. zapisu do odpovedi */
			Q.nfcall(fs.readFile, callersMessage.path)
				.then(function (data) {
					return app._fireEvent(event, data, sessionId);
				})
				.then(function (voiceModel) {
					res.send(
						VoiceViewEngine.renderView(voiceModel.viewName, voiceModel, true)
					);
				})
				.fail(function (err) {
					next(new Error(err));
				});
		}
		else {
			next(new Error('Received request to save recording but it is null or empty.'));
		}
	},

	bindRoutes: function () {
		var app = this,
			server = app.server;

		server.namespace('/' + app.route, function () {
			server.get('/', app.stateMachineHandler.bind(app));
			server.get('/' + app.config.stateMachineHandlerURL, app.stateMachineHandler.bind(app));
			server.post('/' + app.config.recordingHandlerURL, app.saveRecordingHandler.bind(app));
		});
	},

	getConfigValue: function (key) {
		return this.config[key];
	}
});

// PUBLIC API EXPORT
module.exports = Application;
