'use strict';

var
	_  = require('lodash-node'),
	ExpressionEvaluator = require('./expression-evaluator.js'),
	Step = require('./step.js'),
	logger = require('./util/logger.js')(__filename);

function StepPreprocessor(expressionEvaluator){
	this.expressionEvaluator = expressionEvaluator;
};

StepPreprocessor.prototype.process = function(client, step){
	var expressionEvaluator = this.expressionEvaluator;
    
	return client.then(function() {
		var evaluatedStep = step.map(expressionEvaluator.getValue.bind(expressionEvaluator));
		
		logger.info('Command -', evaluatedStep.getCommand(), ':', evaluatedStep.getContext())
		
		if(evaluatedStep.getCommand() === Step.Commands.Store){
			var evaluatedStepContext = evaluatedStep.getContext();
			expressionEvaluator.assign(evaluatedStepContext);
		} else {
			var commandFunction = client[evaluatedStep.getCommand()];
			return commandFunction.apply(client, evaluatedStep.getContextAsArguments());
		}
    });
};

module.exports = StepPreprocessor;