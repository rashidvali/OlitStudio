export const Person = {
    "Person": {
        "Id": "int",
        "FirstName": "string",
        "LastName": "string",
        "HomeAddress": {
            "CARDINALITY": 1,
            "Address": {
                "Id": "int",
                "Street": "string",
                "Apartment": "string",
                "City": "string",
                "State": "string",
                "ZIP": "string"
            }
        },
        "SalesOrder": {
            "CARDINALITY": "*",
            "Order": {
                "Id": "int",
                "OrderNumber": "string",
                "Amount": "money",
                "Currency": "string",
                "OrderDetails": {
                    "CARDINALITY": "*",
                    "OrderDetail": {}    
                }
            }
        }
    }
}
