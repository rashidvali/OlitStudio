import { Obj } from "../TSExt/Obj";
import { Triggeree } from "./Triggeree";

export const EXECUTE_MODE = 3; 

export class Executor
{
    // private static queue
    private static async execute(trg: Triggeree, opt: number)
    {
        if(Obj.isEmpty(trg)){
            return;
        }

        switch(opt)
        {
            case 1:
                trg();

                break;

            case 2:
                await trg();

                break;

            case 3:
                setTimeout( () => {
                    trg(), 0;
                });

                break;
        }
    }

    public static async run(trg: Triggeree){
        this.execute(trg, EXECUTE_MODE);
    }
}

