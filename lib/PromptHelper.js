'use strict';

var Prompt = require('./Prompt');

function renderPrompt (prompt) {
	var buffer = ['<prompt'];

	if (!prompt.bargein) {
		buffer.push(' bargein="false"');
	}

	if (prompt.bargeintype != 'none') {
		buffer.push(' barginetypes="');
		buffer.push(prompt.bargeintype);
		buffer.push('"');
	}

	if (prompt.language) {
		buffer.push(' xml:lang="');
		buffer.push(prompt.language);
		buffer.push('"');
	}

	if (prompt.timeout) {
		buffer.push(' timeout="');
		buffer.push(prompt.timeout);
		buffer.push('s"');
	}

	if (prompt.count) {
		buffer.push(' count="');
		buffer.push(prompt.count);
		buffer.push('"');
	}
	buffer.push('>');
	buffer.push('\n');

	prompt.audios.forEach(function (audio) {
		if (typeof audio === 'string') {
			buffer.push(audio);
		}
		else {
			buffer.push(audio.render());
		}
	});

	buffer.push('</prompt>');
	buffer.push('\n');

	return buffer.join('');
}

function renderHandler (prompts, submitNext, handlerType) {
	var buffer = [],
		count = 1;

	prompts.forEach(function (prompt) {
		buffer.push('<' + handlerType + ' count="');
		buffer.push(count);
		buffer.push('">');
		buffer.push('\n');
		buffer.push(renderPrompt(prompt));
		buffer.push('</' + handlerType +'>');
		buffer.push('\n');
		count += 1;
	});

	buffer.push('<' + handlerType + ' count="');
	buffer.push(count);
	buffer.push('">');
	buffer.push('\n');
	buffer.push('<assign name="event" expr="\'');
	buffer.push(handlerType);
	buffer.push('\'"/>');
	buffer.push('\n');
	buffer.push('<submit next="');
	buffer.push(submitNext);
	buffer.push('" namelist="id event result sessionid"/>');
	buffer.push('\n');
	buffer.push('</' + handlerType + '>');
	buffer.push('\n');

	return buffer.join('');
}

var PromptHelper = {
	voicePrompt: function (prompt) {
		return renderPrompt(prompt);
	},

	noInput: function (prompts, submitNext) {
		return renderHandler(prompts, submitNext, 'noinput');
	},

	noMatch: function (prompts, submitNext) {
		return renderHandler(prompts, submitNext, 'nomatch');
	}
};

module.exports = PromptHelper;
