import { holofante } from './cases/holofante.js';
import { testamentus } from './cases/testamentus.js';
import { cassiwatch } from './cases/cassiwatch.js';
import { cassi } from './cases/cassi.js';

// Bind to the global window object so script.js can access it natively
// This replaces the old "const portfolioCases = []" declaration
window.portfolioCases = [
    holofante,
    testamentus,
    cassiwatch,
    cassi
];