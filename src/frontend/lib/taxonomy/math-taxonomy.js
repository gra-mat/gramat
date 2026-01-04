import {ArithmeticBranch} from './taxonomy/arithmetic.js';

export const MathTaxonomy = {
  id: 'math',
  label: 'Matematyka',
  children: {
    arithmetic: ArithmeticBranch,
    // algebra: AlgebraBranch,
    // geometry: GeometryBranch
  }
};

//do znalezienia niezaledznie od glebokosci
export function findNodeById(id, node = MathTaxonomy) {
    if (node.id === id) return node;
    if (node.children) {
        for (const key in node.children) {
            const found = findNodeById(id, node.children[key]);
            if (found) return found;
        }
    }
    return null;
}