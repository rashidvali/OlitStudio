import { Domlet } from "../../Domoliter/Domlet";
import { DomletBuilder } from "../../Domoliter/DomletBuilder";
import { Domolit } from "../../Domoliter/Domolit";
import { AppPartType } from "../../Domoliter/AppPartType";
import { AppRoute } from "../Navigation/AppRoute";

export class SwitchDomlet extends Domlet
{
    private active: Domlet;

    protected domletId: string = null;
    protected mountId: string = null;

    private defaultKey: string = null;
    private _routes: AppRoute[]
    
    public readonly routeMap = new Map<string, AppRoute>();
    public readonly singletons = new Map<string, Domlet>();

    public labelTextService: any = null;
    public dataPrefix: string = null;

    constructor(root: Node = null, id: string = null)
    {
        super(root, id)
    }

    public settleRoutes(routes: AppRoute[])
    {
        if(!!routes)
        {
            this._routes = routes;
            for(let r of routes)
            {
                this.routeMap.set(r.key, r);

                if(this.defaultKey == null || r.isDefault){
                    this.defaultKey = r.key;
                }
            }
        }
    }

    public routs(): AppRoute[]{
        return this._routes;
    }

    public get mount(): Domlet{
        return this.childByKey("content-mount");
    }

    public navigateContentDomlet(key: string = null): Domlet
    {
        if(key == null){
            key = this.defaultKey;
            
        }

        let route = this.routeMap.get(key);
        if(!route){
            return null;
        }

        let old = this.active;
    
        let activeLoadedFirstTime = false;
        if(route.isSingleton === true){
            if(this.singletons.has(key)){
                this.active = this.singletons.get(key);
            }
            else{
                this.active =<Domlet> DomletBuilder.build(this.routeMap.get(key).appPart);
                this.singletons.set(key, this.active);
                activeLoadedFirstTime = true;
                this.active.isSingleton = true;
            }
        }
        else{
            this.active = <Domlet> DomletBuilder.build(this.routeMap.get(key).appPart);
            activeLoadedFirstTime = true;
            this.active.isSingleton = false;
        }

        if(!!old){
            this.mount.replaceChild(this.active, old);
        }
        else{
            this.mount.addChild(this.active)
        }        

        return this.active;
    }

    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,                      
            children: [
                {
                    type: AppPartType.domolit,
                    key: "content-mount",
                    attributes: [{name: "data-name", value: "content-mount"}],  // just to make it visible in the source in a browser
                    id: this.mountId
                }
            ]
        });
    }

    public appPartType(): AppPartType{
        return AppPartType.navigation_switch;
    }

    // public getPage(key: string = null): Domlet
    // {
    //     if(key == null){
    //         key = this.defaultKey;
    //     }

    //     let route = this.routeMap.get(key);
    //     if(!route){
    //         return null;
    //     }

    //     // let res: Domlet = null;

    //     let activeLoadedFirstTime = false;
    //     if(route.isSingleton === true){
    //         if(this.singletons.has(key)){
    //             this.active = this.singletons.get(key);
    //         }
    //         else{
    //             this.active = DomletBuilder.build(this.routeMap.get(key).appPart);
    //             this.singletons.set(key, this.active);
    //             activeLoadedFirstTime = true;
    //             this.active.isSingleton = true;
    //         }
    //     }
    //     else{
    //         this.active = DomletBuilder.build(this.routeMap.get(key).appPart);
    //         activeLoadedFirstTime = true;
    //         this.active.isSingleton = false;
    //     }

    //     if(activeLoadedFirstTime){
    //         this.active.afterLoading();
    //     }

    //     return this.active;
    // }
}