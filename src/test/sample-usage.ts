import { n } from "../olitcore";
import { q } from "../olitql";

const doc = n`
Person:
	name: Alice
	age: 30
`;

const query = q`
action: query
statement:
	Business_Employee:
		Name: _ LIKE 'J%'
		Projects:
			Project_Code: _ LIKE 'A%'
`;
