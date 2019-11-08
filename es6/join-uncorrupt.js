function joinUncorrupt(parts, contains) {
	// Before doing this "uncorruption" method here, this was done with the `part.emptyValue` trick, however, there were some corruptions that were not handled, for example with a template like this :
	//
	// ------------------------------------------------
	// | {-w:p falsy}My para{/falsy}   |              |
	// | {-w:p falsy}My para{/falsy}   |              |
	// ------------------------------------------------
	let collecting = "";
	let currentlyCollecting = -1;
	return parts.reduce(function(full, part) {
		for (let i = 0, len = contains.length; i < len; i++) {
			const { tag, shouldContain, value } = contains[i];
			if (currentlyCollecting === i) {
				if (part === `</${tag}>`) {
					currentlyCollecting = -1;
					return full + collecting + value + part;
				}
				collecting += part;
				if (
					part.indexOf(`<${shouldContain} `) !== -1 ||
					part.indexOf(`<${shouldContain}>`) !== -1
				) {
					currentlyCollecting = -1;
					return full + collecting;
				}
				return full;
			}
			if (currentlyCollecting === -1 && part.indexOf(`<${tag}`) === 0) {
				currentlyCollecting = i;
				collecting = part;
				return full;
			}
		}
		return full + part;
	}, "");
}

module.exports = joinUncorrupt;
