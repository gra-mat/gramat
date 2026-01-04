import { checkCommon } from './classifiers/common.js';
import { checkArithmetic } from './classifiers/arithmetic.js';

export function classifyError(correctVal, givenVal, operation) {
    const correct = parseFloat(correctVal);
    const given = parseFloat(givenVal);

    if (Math.abs(correct - given) < 0.0001) return null;

    if (isNaN(correct) || isNaN(given)) return null;

    const commonError = checkCommon(correct, given);
    if (commonError) return commonError;

    switch (operation) {
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            return checkArithmetic(correct, given, operation);
        
        //case 'quadratic': 

        default:
            return null;
    }
}