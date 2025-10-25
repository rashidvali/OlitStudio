import { EQUALS, NOT_NULL, N_EQLS } from "../DataProcess/Functors";

enum Entities{
    Address = "Address",
    Orders = "Orders",
    User = "User"
}

class Entity
{
    ID?: any = null;
}

class Address extends Entity
{
    // ID?: any = null;
    Street?: any = null;
    City?: any = null;
    State?: any = null;
    Zip?: any = null;
}

class Orders extends Entity
{
    UserId?: any = null;
}

class User extends Entity
{
    // ID?: any = null;
    FirstName?: any = null;
    LastName?: any = null;
    Username?: any = null;
    Phone?: any = null;
    Email?: any = null;
    Password?: any = null;
    Address?: Address = new Address(); // address;
}    

let address = new Address();
let orders = new Orders();
let user = new User();

function selfreflect(obj: any)
{
    Object.keys(obj).forEach(key => {
        // console.log(key, ", ", obj[key] instanceof Entity);

        if(!(obj[key] instanceof Entity)){
            obj[key] = key;
            console.log(key, ", ", obj[key] );                
        }

    });
}

function select(...fields: any[]): any[]{
    let res = new Array<any>();

    if(!!arguments){
        for(let e of arguments){
            res.push(e);
        }
    }
    return res;
}

class Selection
{
    public entity: Entities;
    public fields?: any[];
    public joint?: Joint;
}

class Filter
{
    public filter: Entity | Entity[]
}

class Joint
{
    pid: any;   // parent ID
    cid: any;   // child ID
}

class Query
{
    public selection: Selection;
    public filter?: Filter;
}

export class Person
{
    public FirstName: any;
    public LastName: any;
}

// Person.FirstName


let tmp1 = (u:User) => select(user.ID, user.FirstName, user.LastName,
    {
        entity: Entities.Address,
        fields: select(address.Street, address.City)
    },
    {
        entity: Entities.Orders,
        fields: select(orders.UserId),
        // joint: {
        //     pid: user.ID,
        //     cid: orders.UserId
        // }
    }
)


let query2 = <Query> {
    selection: <Selection> 
    {
        entity: Entities.User,
        fields: select(user.ID, user.FirstName, user.LastName,
                {
                    entity: Entities.Address,
                    fields: select(address.Street, address.City)
                },
                {
                    entity: Entities.Orders,
                    fields: select(orders.UserId),
                    // joint: {
                    //     pid: user.ID,
                    //     cid: orders.UserId
                    // }
                }
            )
    },
    filter: <User> {
        FirstName: NOT_NULL(),
        LastName: N_EQLS("Nick"),
        Address: <Address> {
            State: EQUALS("WA")
        }
    }
};

// console.log("--");
// selfreflect(address);
// console.log("--");
// selfreflect(orders);
// console.log("--");
// selfreflect(user);
// console.log("--");

