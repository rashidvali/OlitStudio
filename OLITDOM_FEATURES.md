# OlitDOM Advanced Features

## 1. Go to Definition Support

OlitDOM now includes "Go to Definition" functionality for TypeScript objects referenced within `d`` templates.

### How to Use:
1. **Ctrl+Click** (or **Cmd+Click** on Mac) on any TypeScript object name in OlitDOM
2. VS Code will navigate to the definition of classes, interfaces, enums, types, or variables

### Supported Patterns:
- **Classes**: `class MyComponent`
- **Interfaces**: `interface IProps` 
- **Enums**: `enum AppPartType`
- **Types**: `type ButtonVariant`
- **Variables**: `const myVariable`

### Example:
```typescript
// Define types
interface IButtonProps {
    label: string;
    variant: 'primary' | 'secondary';
}

class BaseButton {
    render() { }
}

// Use in OlitDOM with Go to Definition support
const button = d`
Component: BaseButton        // Ctrl+Click → goes to class definition
interface: IButtonProps     // Ctrl+Click → goes to interface definition
props:
    label: 'Click Me'
    variant: 'primary'
`;
```

## 2. HTML Template Integration

OlitDOM supports HTML templating in two ways, replacing the need for lit-element dependency:

### Option 1: Inline HTML Strings
```typescript
const component = d`
Component: MyComponent
class: BaseComponent
inner_html: '<div class="wrapper"><h1>\${title}</h1></div>'
state:
    title: 'Hello World'
`;
```

### Option 2: External HTML Templates  
```typescript
// Create reusable HTML template
const buttonTemplate = html`
    <button class="btn \${variant}">
        <span>\${label}</span>
        <i class="icon \${iconClass}"></i>
    </button>
`;

// Reference in OlitDOM
const component = d`
Component: ButtonComponent
class: BaseButton
template: buttonTemplate
props:
    label: 'Submit'
    variant: 'btn-primary'
    iconClass: 'fa-check'
`;
```

### HTML Template Features:
- **Variable interpolation**: `\${variableName}` 
- **Syntax highlighting**: HTML content gets proper syntax highlighting
- **No external dependencies**: Works without lit-element
- **Reusable**: Templates can be shared across components

## 3. Migration from lit-element

### Before (lit-element):
```typescript
import { html, TemplateResult } from 'lit-element';

interface Domolit {
    inner_html?: TemplateResult<1>;
}

const component: Domolit = {
    type: AppPartType.html_template,
    inner_html: html`
        <div class="component">
            <h1>${title}</h1>
        </div>
    `
};
```

### After (OlitDOM):
```typescript
import { d, html } from './olitdom';

const component = d`
type: AppPartType.html_template
Component: MyComponent
inner_html: '<div class="component"><h1>\${title}</h1></div>'
# OR use external template:
template: html`<div class="component"><h1>\${title}</h1></div>`
state:
    title: 'My Title'
`;
```

## 4. Domolite Framework Integration

OlitDOM is designed to replace TypeScript interfaces in the Domolite framework:

### Current Domolite (TypeScript interfaces):
```typescript
export interface Domolit {
    type?: AppPartType;
    class?: any;
    inner_html?: TemplateResult<1>;
    children?: Domolit[];
    // ... many more properties
}
```

### Future Domolite (OlitDOM):
```typescript
const headerComponent = d`
type: AppPartType.domolit
class: AppHeaderDomlet
children:
    type: AppPartType.html_template
    element: div
    inner_html: '<div class="header">Header Content</div>'
methods:
    template: () => Domolit
    render: () => void
`;
```

## 5. Best Practices

### Use Go to Definition:
- **Organize types**: Keep interfaces and classes in separate files for better navigation
- **Consistent naming**: Use PascalCase for classes/interfaces, camelCase for variables
- **Import explicitly**: Import types you reference for better IDE support

### HTML Templates:
- **Escape variables**: Use `\${variable}` for template interpolation
- **Reuse templates**: Create common templates in separate variables
- **Keep HTML clean**: Use CSS classes instead of inline styles

### OlitDOM Structure:
- **Consistent formatting**: Use consistent indentation and spacing
- **Group related properties**: Keep related properties together
- **Document complex logic**: Add comments for complex component definitions

## 6. Performance Considerations

- **Go to Definition**: Searches are limited to 100 files for performance
- **HTML Templates**: Templates are processed at runtime, consider caching for complex templates
- **Type Resolution**: Works best with explicit imports and clear type definitions