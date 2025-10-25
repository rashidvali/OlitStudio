export class Entity{
    Where?: any;
}
export class Property{}

export class Person extends Entity
{
    Id?: any = "int";
    FirstName?: any = "string";
    LastName?: any = "string";
    HomeAddress?: any = [
        "Address"
    ];
    SalesOrder?: any = [
        "Order[]"
    ];
}

export class Address extends Entity
{
    Id?: any = "int";
    Street?: any = "string";
    Apartment?: any = "string";
    City?: any = "string";
    State?: any = "string";
    ZIP?: any = "string";
}

export class Order extends Entity
{
    Id?: any = "int";
    OrderNumber?: any = "string";
    Amount?: any = "money";
    Currency?: any = "string";
    OrderDetails?: any =  [
        "OrderDetail[]"
    ];
}

export class OrderDetail extends Entity
{
    Id?: any = "int";
    SalesOrderID?: any = "int";
    SalesOrderDetailID?: any = "int";
    OrderQty?: any = "int";
    ProductID?: any = "int";
    UnitPrice?: any = "money";
    LineTotal?: any = "money"; 
}

export const Table = [
    Person,
    Address,
    Order,
    OrderDetail
];

export const Hierarchy = [
{
    "Person": {
        "HomeAddress": {
            "CARDINALITY": 1,
            "Address": {
            }
        },
        "SalesOrder": {
            "CARDINALITY": "*",
            "Order": {
                "OrderDetails": {
                    "CARDINALITY": "*",
                    "OrderDetail": {}    
                }
            }
        }
    }
}];

export const DbContext = (() => {
    let arr = [];

    for(let c of Table){
        let o = new c();
        arr.push(
            {[c.prototype.constructor.name]: o}
        );
    }  

    for(let h of Hierarchy){
        arr.push(h);
    }
    
    let json = JSON.stringify(arr);
    return json;
})();

