export function IN(value: string|number, ...values: (string|number)[]):boolean
{
    if(value == undefined || !values || values.length == 0){
        return false;
    }

    for(let elm of values){
        if(value == elm){
            return true;
        }
    }

    return false;
}