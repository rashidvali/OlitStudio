import { n } from "../olitcore";
import { q } from "../olitql";
import { d } from "../olitdom";

// Test Olit Notation	

const data = n`
FirstName: Anna
LastName: Bosh Dodo
Location:
	Building: G101
	Floor: 
		3
	Room: 304
Books:
	Oliver Twist
	;
	War and Piece
	;
	2024-11-04
`;

// Test OlitQl
const query = q`
action: _ create domain
domains:
	Business
	;
`;

// Test OlitDOM
const component = d`
type: AppPartType.domolit
children: AppPartType.html_template
inner_html: 
	<div data-name="footer" class="fixed-bottom">
		<!-- app-footer -->
	</div>
`;
export class MyTestClass2{
	method1() {}
}
