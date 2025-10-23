import { n } from "../olitcore";
import { q } from "../olitql";

const doc = n`
Person:
	name: Alice
	age: 30
`;

const query = q`
action: _ 'query'
vegy: 'bush'
statement:
	Business_Employee:
		F.Name1: _ LIKE 'J%'
		F_Name2: 
			_  =='J%'
		Projects:
			Project_Code: _ LIKE + - '_A%'
			;
			ddd
`;
