'use strict';

var vxml = require('../../index'),
	WeatherService = require('./WeatherService');

var WeatherCtrl = vxml.CallFlow.extend({

	constructor: function () {
		WeatherCtrl.super.call(this);
	},

	create: function* () {
		this.addState(
			vxml.State.create('greeting', new vxml.Say('Welcome to Weather Voice.'), 'getZip'));

		this.addState(
			vxml.State.create('getZip', new vxml.Ask({
				prompt: 'Enter the five digit zip code for the area where you would like the weather report on.',
				grammar: new vxml.BuiltinGrammar({
					type: 'digits',
					length: 5
				})
			}), 'getWeather')
		);

		var getWeatherState = new vxml.State('getWeather', 'voiceWeather')
			.addOnEntryAction(function* (cf, state, event) {
				// stahnu informace o pocasi
				var weatherData = yield WeatherService.getWeatherByZipCode(event.data);
				cf.weather = weatherData;
				yield cf.fireEvent('continue');
			});

		this.addState(getWeatherState);

		var weatherPrompt = new vxml.Prompt([
			'The temperature today is ',
			new vxml.Var(this, 'weather.temp', ' '),
			new vxml.Silence(1000),
			'The conditions are ',
			new vxml.Var(this, 'weather.conditions')
		]);

		this.addState(
			vxml.State.create('voiceWeather', new vxml.Say({
				prompt: weatherPrompt
			}), 'goodbye')
		);

		this.addState(
			vxml.State.create('goodbye', new vxml.Exit('Thank you for using Weather Voice. Goodbye.'))
		);
	}
});

module.exports = WeatherCtrl;
