import { MathTaxonomy } from '../taxonomy/math-taxonomy.js';

const NAT = MathTaxonomy.children.arithmetic.children.natural_numbers;

export function checkArithmetic(correct, given, operation) {
    const diff = Math.abs(correct - given);

    if (operation === 'addition') {
        if (diff === 1) return { error: NAT.children.addition.errors.off_by_one };
        if (diff % 10 === 0) return { error: NAT.children.addition.errors.carry_error };
    }

    if (operation === 'subtraction') {
        if (diff === 1) return { error: NAT.children.subtraction.errors.off_by_one }; // (lub zdefiniuj osobny błąd)
        if (given === Math.abs(correct)) return { error: NAT.children.subtraction.errors.reverse_sub };
    }

    return null;
}