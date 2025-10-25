import { n } from "../olitcore";
import { q } from "../olitql";
import { d, html } from "../olitdom";

// Import some TypeScript objects for testing "Go to Definition"
import { AppPartType } from "./TSObject/Domoliter/AppPartType";

// Define some interfaces for testing Go to Definition
interface IButtonProps {
    label: string;
    variant: 'primary' | 'secondary';
    onClick: () => void;
}

interface ValidationErrors {
    [field: string]: string[];
}

interface ButtonState {
    isPressed: boolean;
    isDisabled: boolean;
}

class AppHeaderDomlet {
    template() { return {}; }
}

class BaseButton {
    handleClick() { }
}

class BaseComponent {
    render() { }
}

// Base Olit Notation (n``)
const doc = n`
Person:
	name: Alice
	age: 30
`;

// OlitQL - Database queries (q``)
const query = q`
action: _ 'query'
vegy: 'bush'
statement:
	Business_Employee:
		F.Name1: _ LIKE 'J%'
		F_Name2: 
			_  =='J%'
		Projects:
			Project_Code: _ LIKE + - '_ LIKE IN <> A%'
			;
			ddd
`;

// OlitDOM - TypeScript objects + base notation (d``)
const component = d`
Component: ButtonComponent
className: MyButton
interface: IButtonProps
	label: string
	onClick: () => void
	disabled: boolean
state: ComponentState
	isLoading: false
	isHovered: false
props:
	variant: 'primary'
	size: 'medium'
	icon: IconType
methods:
	handleClick: Function
	validateProps: (props: IButtonProps) => boolean
enum: ButtonVariant
	PRIMARY: 'primary'
	SECONDARY: 'secondary' 
	DANGER: 'danger'
`;

// OlitDOM for Domolite framework - replacing TypeScript interface syntax
// Current: interface Domolit { type?: AppPartType; class?: any; ... }
// Future: OlitDOM notation for cleaner component definition

const appHeaderDomolit = d`
type: AppPartType.domolit
class: AppHeaderDomlet
children:
	type: AppPartType.html_template
	inner_html: TemplateResult<1>
	element: div
	attributes:
		class: 'fixed-top app-header'
	content: '<!-- app-header -->'
`;

const complexDomolit = d`
type: AppPartType.domlet
class: ComponentClass
id: 'main-component'
name: 'MainComponent'
parent: true
authentication: false
attributes:
	name: 'data-component'
	value: 'main'
ns_attributes:
	namespace: 'custom'
	name: 'type' 
	value: 'widget'
methods:
	name: 'initialize'
	values: []
children:
	type: AppPartType.html_element
	element: 'section'
	id: 'content-section'
	children:
		type: AppPartType.html_template
		inner_html: TemplateResult<1>
routes:
	AppRoute[]
collected: AppRouting
name_data_prefix: 'sw-'
options_data_service: LabelTextService
messageWires: MessageWireSignature[]
services: Domolit[]
portConnectSignature: PortHubConnectSignature
`;

// Real Stars-Whisper component in OlitDOM notation
const starsWhisperHeader = d`
type: AppPartType.domolit
class: AppHeaderDomlet
extends: Domlet
children:
	type: AppPartType.html_template
	element: div
	class: 'fixed-top app-header'
	inner_html: TemplateResult
	content: '<!-- Stars Whisper App Header -->'
methods:
	template: () => Domolit
	domolit: (config: any) => Domolit
`;

// OlitDOM String Rules Demo:
// ✅ No quotes needed for simple strings  
// ✅ Double quotes are optional
// ✅ Single quotes are content (not delimiters)
const buttonComponent = d`
Component: ButtonComponent
class: BaseButton
interface: IButtonProps
title: Welcome to John's House               # Single quote is content
message: "Welcome to Mary's Store"           # Single quotes inside double quotes
description: This is a bare string value     # No quotes needed
inner_html: <button class="btn">Click</button>
state:
	isPressed: false
	isDisabled: false
props:
	label: Click Me                          # No quotes needed
	iconClass: fa-arrow-right               # No quotes needed  
	variant: primary
	tooltip: "Use 'Enter' key to submit"    # Single quotes as content
methods:
	handleClick: (event: MouseEvent) => void
	updateState: (newState: Partial<ButtonState>) => void
`;

// Example with external HTML template reference
const htmlTemplate = html`
	<div class="component-wrapper">
		<h1>\${title}</h1>
		<button onclick="\${handleClick}">\${buttonText}</button>
	</div>
`;

const componentWithTemplate = d`
Component: ComplexComponent
class: BaseComponent
template: htmlTemplate
state:
	title: Welcome
	buttonText: Get Started
methods:
	handleClick: () => console.log('clicked')
`;

// OlitDOM with TemplateResult<1> reference (for existing lit-element code)
const formComponent = d`
Component: FormComponent  
class: BaseForm
interface: IFormProps
inner_html: TemplateResult<1>
template_ref: formTemplate
validation:
	required: [email, password]
	patterns:
		email: ^[^@]+@[^@]+\\.[^@]+$
		password: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$
state:
	isValid: false
	errors: ValidationErrors
	isSubmitting: false
methods:
	validate: () => boolean
	submit: async (data: FormData) => SubmitResult
	reset: () => void
`;

// String Handling Comparison:
// OlitQL (q``) - Single quotes are delimiters/operators
const queryComparison = q`
name: John's House     # Single quotes are operators here
filter: _ LIKE 'John%'    # Single quotes create string boundaries
`;

// OlitDOM (d``) - Single quotes are just content
const domComparison = d`
name: John's House        # Single quotes are just content
title: "Mary's Store"     # Single quotes inside double quotes are content
message: Welcome to Tom's place  # Single quotes are content
`;

// Testing "Go to Definition" - try Ctrl+Click on these TypeScript objects:
// - AppPartType (should go to enum definition in TSObject folder)
// - IButtonProps (should go to interface definition above)  
// - ValidationErrors (should go to interface definition above)
// - BaseButton (should go to class definition above)
