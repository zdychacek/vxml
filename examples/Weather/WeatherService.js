'use strict';

var Q = require('q');

var WeatherService = {
	getWeatherByZipCode: function (code) {
		var deferred = Q.defer(),
			temp = Math.floor(Math.random() * 40 + 15),
			conditions = ['cloudy', 'windy', 'clear'],
			condition = conditions[Math.floor(Math.random() * conditions.length)];

		deferred.resolve({
			temp: temp + ' degrees',
			conditions: condition
		});

		return deferred.promise;
	}
};

module.exports = WeatherService;
