import { MathTaxonomy } from '../taxonomy/math-taxonomy.js';

const INTEGERS = MathTaxonomy.children.arithmetic.children.integers;
const BASIC = MathTaxonomy.children.arithmetic.children.natural_numbers.children.addition; // Tu przypisaliśmy 'typo'

export function checkCommon(correct, given) {
    //blad znaku
    if (correct === -given) {
        return { error: INTEGERS.children.ops.errors.sign_error };
    }

    //czeski blad
    if (checkTransposition(correct, given)) {
        return { error: BASIC.errors.typo };
    }

    return null;
}

function checkTransposition(numA, numB) {
    const strA = numA.toString();
    const strB = numB.toString();
    if (strA.length < 2 || strA.length !== strB.length) return false;
    return strA.split('').sort().join('') === strB.split('').sort().join('');
}