import { n } from "../olitcore";
import { q } from "../olitql";

const person = n`
	name: Alice
	age: 42
	married: true
	Fielsd2: 
		false
	Filed3: 
		asv
	Field4: 
		2025-10-03
	Field5:
		"asa"
`;

const query = q`
	action: query
	statement:
		Business_Employee:
			Name: _ LIKE 'J%'
			Projects: Project_Code: _ LIKE 'A%'
			Fielsd1: 
				30
				;
				Fielsd2: _ xyz LIKE 'B%'
				;
				true
				;
				34.7
			Fielsd2: 
				false
			Filed3: 
				asv
			Field4: 
				2025-10-03
			Field5:
				"asa"

`;



