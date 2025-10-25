import { $OR, $s, AND, EQUALS, GREATER, IN, LIKE, OR, _, select } from "../DataProcess/Functors";
import { Address, Order, OrderDetail, Person } from "../Stars-Whisper/DataModel/DbContext";



export const q = <Person> {
    FirstName: [$s, $OR, IN("Joe", "Lester", "Gustavo", "Kirk", "Alice")],
    LastName: [$s, IN("Camargo", "King", "Clark", "Bailey", "Huff")]
}

// export const q = <Person> {
//     FirstName: [$OR, "Joe", "Lester", "Gustavo", "Kirk", "Alice", "James"],
//     HomeAddress: {
//         City: []
//     },
//     SalesOrder: <Order[]>[ $AND,
//         {
//             OrderNumber: []
//         }
//     ]
// }

export function _query1()
{
    let query = {
        Person: <Person>{
            FirstName: _+EQUALS("John"), 
            LastName: _+LIKE("%Son%"),
            Id: GREATER(0),
            HomeAddress: {
                City: _, 
                State: _, 
                ZIP: IN("98052", "98007", "98005")
            },
            SalesOrder: [
                {
                    OrderNumber: _+EQUALS(105), 
                    Amount: EQUALS(100)
                }
            ]
        }
    };

    return query;
}

export function _query2()
{
    let _ = "_";
    let $AND = "$_@#_AND";

    let entity;
    let p = new Person();
    let a = new Address();
    let o = new Order();
    let d = new OrderDetail();
    let end;
    
    let query = <Person>  {
        FirstName:_, 
        LastName:_,
        HomeAddress: {
            City:_, 
            State:_, 
            ZIP:_
        },
        SalesOrder: [
            {
                OrderNumber:_, 
                Amount:_
            }
        ],
        
        Where:         
        [
            $AND, p.FirstName = "John", p.LastName = "McCarty \\, \, \\, and \"Son\"",
            p.HomeAddress = {
                Where: [a.Apartment = "A302"]
            },
            p.SalesOrder =
            [
                {
                    Where: [o.Amount = 100, o.Currency = "USD",
                        o.OrderDetails = [
                            {
                                Where: []
                            }
                        ]
                    ]
                }
            ]
        ]
    }
    return query;
}