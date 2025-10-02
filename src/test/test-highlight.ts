import { n } from "../olitcore";
import { q } from "../olitql";

const person = n`
	name: Alice
	age: 42
	married: true
`;

const query = q`
	action: query
	statement:
		Business_Employee:
			Name: _ LIKE 'J%'
			Projects:
				Project_Code: _ LIKE 'A%'
`;



