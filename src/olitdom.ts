// OlitDOM - Enhanced object literal notation with TypeScript object support and HTML templating
export const d = (strings: TemplateStringsArray, ...values: any[]) => {
	console.log("OlitDOM 'd' function processing template:", strings.join('${...}'));
	
	// For now, return a simple object representation
	// In the future, this could integrate with DomletBuilder
	return {
		_olitdom: true,
		template: strings.join('${...}'),
		values: values,
		// Future integration point with Domolite framework
		toDomlet: () => {
			console.log("Converting OlitDOM to Domlet...");
			// This is where integration with DomletBuilder would happen
			return null;
		}
	};
};

// HTML template function that can be used within OlitDOM
export const html = (strings: TemplateStringsArray, ...values: any[]) => {
	console.log("HTML template:", strings.join('${...}'));
	
	// Simple HTML template representation
	// This could be enhanced to return actual TemplateResult<1> compatible objects
	return {
		_template: true,
		html: strings.reduce((result, string, i) => {
			return result + string + (values[i] || '');
		}, ''),
		values: values
	};
};
