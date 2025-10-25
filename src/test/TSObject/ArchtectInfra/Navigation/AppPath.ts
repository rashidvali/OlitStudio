import { Obj } from "../../Lib/TSExt/Obj";
import { Str } from "../../Lib/TSExt/Str";

export class AppPath
{
    public static isEmpty(path: string|AppPath): boolean
    {
        if(Obj.isEmpty(path)){
            return true;
        }
    
        if(path instanceof AppPath)
        {
            if(Str.isStringEmpty(path.toPath())){
                return true;
            }
        }
        else{
            if(Str.isStringEmpty(path)){
                return true;
            }
        }
    
        return false;
    }

    public static toAppPath(path: string|AppPath): AppPath
    {
        if(AppPath.isEmpty(path)){
            return null;
        }

        if(path instanceof AppPath){
            return path;
        }
        else{
            return new AppPath(path);
        }
    }

    public segments: string[];

    public constructor(path: string)
    {
        if(Str.isStringValid(path)){
            this.segments = path.split("/");
        }
    }

    public toPath(): string{
        return this.segments.join("/");
    }

    public setLastSegment(newSegment: string)
    {
        this.segments[this.segments.length - 1] = newSegment;
    }
}