// Evaluates simple arithmetic expressions like "152 * 3" or "100 / 3".
// Supports +, -, *, / with standard operator precedence.
// Returns null if the expression is invalid.
const evaluateMathExpression = (expression: string): number | null => {
	const trimmed = expression.trim();
	if (trimmed === "") return null;

	// If it's already a plain number, return it directly
	const asNumber = Number(trimmed);
	if (!Number.isNaN(asNumber)) return asNumber;

	// Match: number (operator number)+
	// Supports decimals and negative first operand
	const tokenPattern = /^-?\d+(\.\d+)?(\s*[+\-*/]\s*-?\d+(\.\d+)?)+$/;
	if (!tokenPattern.test(trimmed)) return null;

	// Tokenize into numbers and operators
	const tokens: (number | string)[] = [];
	const tokenRegex = /(-?\d+(?:\.\d+)?)|([+\-*/])/g;
	let match = tokenRegex.exec(trimmed);
	while (match) {
		if (match[1] !== undefined) {
			tokens.push(Number(match[1]));
		} else if (match[2] !== undefined) {
			tokens.push(match[2]);
		}
		match = tokenRegex.exec(trimmed);
	}

	if (tokens.length < 3 || tokens.length % 2 === 0) return null;

	// Evaluate with operator precedence: first * and /, then + and -
	// First pass: handle * and /
	const addSubTokens: (number | string)[] = [];
	let i = 0;
	addSubTokens.push(tokens[i] as number);
	i++;
	while (i < tokens.length) {
		const op = tokens[i] as string;
		const right = tokens[i + 1] as number;
		if (op === "*" || op === "/") {
			const left = addSubTokens.pop() as number;
			if (op === "/" && right === 0) return null;
			addSubTokens.push(op === "*" ? left * right : left / right);
		} else {
			addSubTokens.push(op);
			addSubTokens.push(right);
		}
		i += 2;
	}

	// Second pass: handle + and -
	let result = addSubTokens[0] as number;
	for (let j = 1; j < addSubTokens.length; j += 2) {
		const op = addSubTokens[j] as string;
		const right = addSubTokens[j + 1] as number;
		result = op === "+" ? result + right : result - right;
	}

	if (!Number.isFinite(result)) return null;

	// Round to 2 decimal places to avoid floating point noise
	return Math.round(result * 100) / 100;
};

export { evaluateMathExpression };
