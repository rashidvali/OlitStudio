export function ModelFactory(empty = true)
{
    let model = {
        Person: {
            Id: empty ? null : <any> "int",
            FirstName: empty ? null : <any> "string",
            LastName: empty ? null : <any> "string",
            Address: {
                Id: empty ? null : <any> "int",
                Street: empty ? null : <any> "string",
                Apartment: empty ? null : <any> "string",
                City: empty ? null : <any> "string",
                State: empty ? null : <any> "string",
                ZIP: empty ? null : <any> "string"
            },
            Order: [
                {
                    Id: empty ? null : <any> "int",
                    Amount: empty ? null : <any> "money",
                    Currency:  empty ? null : <any>"string"
                }
            ]
        }        
    }    

    return model;
}

export function ModelFactory2(empty = true)
{
    let model = {
        Person: {
            Id: empty ? null : <any> "int",
            FirstName: empty ? null : <any> "string",

            LastName: empty ? null : <any> "string",

            // Lastname: { "string": { value: <any> null } },
            // Firstname: {
            //     "string": {
            //         value: <any> null
            //     }
            // },

            HomeAddress: {
                Address: {
                    Id: empty ? null : <any> "int",
                    Street: empty ? null : <any> "string",
                    Apartment: empty ? null : <any> "string",
                    City: empty ? null : <any> "string",
                    State: empty ? null : <any> "string",
                    ZIP: empty ? null : <any> "string"
                    }
            },
            // TradeOrder: {
            //     Order: [
            //         {
            //             Id: empty ? null : <any> "int",
            //             Amount: empty ? null : <any> "money",
            //             Currency:  empty ? null : <any>"string"
            //         }
            //     ]
            // },
            SalesOrders: [
                {
                    Order: {
                        Id: empty ? null : <any> "int",
                        Amount: empty ? null : <any> "money",
                        Currency:  empty ? null : <any>"string"
                    }
                }
            ]
        }
    }

    return model;
}

export function ModelFactory3(empty = true)
{
    let model = {
        Person: {
            Id: empty ? null : <any> "int",
            FirstName: empty ? null : <any> "string",

            LastName: empty ? null : <any> "string",

            HomeAddress: {
                Cardinality: [1],
                Address: {
                    Id: empty ? null : <any> "int",
                    Street: empty ? null : <any> "string",
                    Apartment: empty ? null : <any> "string",
                    City: empty ? null : <any> "string",
                    State: empty ? null : <any> "string",
                    ZIP: empty ? null : <any> "string"
                    }
            },
            SalesOrder: {
                Cardinality: ['*'],
                Order: {
                    Id: empty ? null : <any> "int",
                    Amount: empty ? null : <any> "money",
                    Currency:  empty ? null : <any>"string"
                }
            },
            wheals: {
                Cardinality: [4, 6, 10, 14]
            },
            somes: {
                Cardinality: [0,1,'*']
            },
            others: {
                Cardinality: [7.8]
            }

        }
    }

    return model;
}

let model1 = ModelFactory();
// model.Person.Address.Apartment = 7
model1.Person.Id = "good";

let model2 = ModelFactory(false);
model1

let m3 = ModelFactory2();
// let x = m3.Person.Firstname.string.value;
// let y = m3.Person.Lastname.string.value;
// console.log(m3);
