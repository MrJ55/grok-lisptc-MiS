// A little arithmetic in TypeScript 4.6 by SUZUKI Hisao (R01.08.04/R04.03.26)
//  derived from arith.ts at github.com/nukata/little-scheme-in-typescript

export type Numeric = number | bigint;

// A Number value is treated as an inexact number.
// A BigInt value is treated as an exact number.
// Any operation involving an inexact number produces an inexact number.

export const ZERO: Numeric = 0n;
export const ONE: Numeric = 1n;

export function isNumeric(x: unknown): x is Numeric {
	return typeof x === "number" || typeof x === "bigint";
}

export function tryToParse(s: string): Numeric | undefined {
	if (/^[+-]?\d+$/.test(s)) return BigInt(s);
	const n = Number(s);
	if (!Number.isNaN(n)) return n;
	return undefined;
}

export function convertToString(x: Numeric): string {
	return x.toString();
}

export function add(a: Numeric, b: Numeric): Numeric {
	if (typeof a === "bigint" && typeof b === "bigint") return a + b;
	return Number(a) + Number(b);
}

export function subtract(a: Numeric, b: Numeric): Numeric {
	if (typeof a === "bigint" && typeof b === "bigint") return a - b;
	return Number(a) - Number(b);
}

export function multiply(a: Numeric, b: Numeric): Numeric {
	if (typeof a === "bigint" && typeof b === "bigint") return a * b;
	return Number(a) * Number(b);
}

export function divide(a: Numeric, b: Numeric): Numeric {
	return Number(a) / Number(b);
}

export function quotient(a: Numeric, b: Numeric): Numeric {
	if (typeof a === "bigint" && typeof b === "bigint") return a / b;
	return Math.trunc(Number(a) / Number(b));
}

export function remainder(a: Numeric, b: Numeric): Numeric {
	if (typeof a === "bigint" && typeof b === "bigint") return a % b;
	return Number(a) % Number(b);
}

export function compare(a: Numeric, b: Numeric): number {
	if (typeof a === "bigint" && typeof b === "bigint") {
		return a < b ? -1 : a > b ? 1 : 0;
	}
	const x = Number(a),
		y = Number(b);
	return x < y ? -1 : x > y ? 1 : 0;
}
