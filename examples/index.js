require('express-namespace');

const fs = require('fs'),
	express = require('express'),
	vxml = require('../index'),
	app = express(),
	server = require('http').createServer(app),
	PORT = process.env.PORT;

//var logFile = fs.createWriteStream('./myLogFile.log', {flags: 'a'});

app.use(express.favicon());
//app.use(express.logger({ stream: logFile }));
//app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use('/static', express.static(__dirname + '/static'));

app.use(express.errorHandler({
	dumpExceptions: true,
	showStack: true
}));

// vytvoreni aplikaci
vxml.Application.create({
	server: app,
	route: '/app',
	controller: require('./AppCtrl')
});

vxml.Application.create({
	server: app,
	route: '/helloWorld',
	controller: require('./HelloWorldCtrl')
});

vxml.Application.create({
	server: app,
	route: '/dynamicMenu',
	controller: require('./DynamicMenu/DynamicMenuCtrl')
});

vxml.Application.create({
	server: app,
	route: '/mayhemVoice',
	controller: require('./MayhemVoiceCtrl')
});

vxml.Application.create({
	server: app,
	route: '/weatherVoice',
	controller: require('./WeatherVoice/WeatherVoiceCtrl')
});

vxml.Application.create({
	server: app,
	route: '/dateDifference',
	controller: require('./DateDifference/DateDifferenceCtrl'),
	config: {
		fetchtimeout: 999
	}
});

vxml.Application.create({
	server: app,
	route: '/matrijoska',
	controller: require('./Matrijoska/MatrijoskaCtrl'),
	config: {
		fetchtimeout: 999
	}
});

vxml.Application.create({
	server: app,
	route: '/recording',
	controller: require('./RecordingCtrl'),
	config: {
		fetchTimeout: 999
	}
});

vxml.Application.create({
	server: app,
	route: '/grammarTest',
	controller: require('./GrammarTest'),
	config: {
		fetchTimeout: 999
	}
});

server.listen(PORT);
console.log('Express started on port ' + PORT);
