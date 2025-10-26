// Test file for OlitDOM "Go to Definition" functionality

class TestClass {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}

interface TestInterface {
    id: number;
    value: string;
}

enum TestEnum {
    FIRST = 'first',
    SECOND = 'second'
}

type TestType = {
    data: string;
}

function testFunction(): void {
    console.log('test');
}

const testConst = 'hello';

// OlitDOM template using the defined types
const template = d`
    TestClass
    TestInterface  
    TestEnum
    TestType
    testFunction
    testConst
`;