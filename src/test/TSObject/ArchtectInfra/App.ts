import { CU } from "../Alternative/CU";
import { MessageWire } from "../Alternative/MessageWire";
import { AppPartType } from "../Domoliter/AppPartType";
import { Domlet } from "../Domoliter/Domlet";
import { DomletBuilder } from "../Domoliter/DomletBuilder";
import { Domolit } from "../Domoliter/Domolit";
import { Str } from "../Lib/TSExt/Str";
import { MenuDomlet } from "./AppStructure/Menu.Domlet";
import { SwitchDomlet } from "./AppStructure/Switch.Domlet";
import { AppPath } from "./Navigation/AppPath";

export class App
{
    private static page_title: string;
    private static isDocumentLoadedIntoBrowser = false;
    private static appStruct: Domolit;
    private static appDomlet: Domlet;
    private static currentPath: AppPath;
    private static rootKey: string;
    private static pageName: string;
    
    public static readonly dMsgWr = new Map<string, MessageWire>(); // directed app message wires
    public static readonly uMsgWr = new Map<string, MessageWire>(); // undirected app message wires
    private static serviceMap: Map<string, CU>;

    public static TMP_TAB = "    ";

    public static init(appStruct: Domolit, rootKey: string)
    {
        this.page_title = appStruct.name;
        this.appStruct = appStruct;

        this.serviceMap = new Map<string, CU>();
        this.appDomlet = <Domlet> DomletBuilder.build(appStruct);

        let mainFrame = document.getElementById("main-frame");
        mainFrame.appendChild(this.appDomlet.dRoot());
        this.appDomlet.triggerAfterLoadingEvent();
        document.body.setAttribute("class", "global");
        
        this.isDocumentLoadedIntoBrowser = true;
        this.rootKey = rootKey;

        window.addEventListener("popstate", (e) => {
            let p = window.location.pathname;
            p = Str.trimHead("/" + this.pageName, p);
            this.move(p);
        });

        // window.onbeforeunload = (e) => {
        //     window.history.replaceState(null, null, "https://localhost:8086");
        //     // e.preventDefault();
        //     // e.stopImmediatePropagation();
        //     // e.stopPropagation();
        // }

        let path = window.location.pathname;
        this.currentPath = new AppPath(path);
        this.pageName = path.split("/").pop();
    }

    public static isDocumentLoaded(){
        return this.isDocumentLoadedIntoBrowser;
    }

    public static navigate(path: string|AppPath)
    {
        let pth = AppPath.toAppPath(path);

        if(pth == null){
            return;
        }

        this.move(pth);
        this.updateBrowserHistory(pth);        
    }

    public static updateBrowserHistory(path: string|AppPath)
    {
        let pth = AppPath.toAppPath(path);
        // window.history.pushState(null, "", `${this.hostPage()}${pth.toPath()}`);
        this.pushPath(`${this.hostPage()}${pth.toPath()}`);
        document.title = this.page_title + pth.toPath();        
    }

    public static pushPath(path: string){
        window.history.pushState(null, "", path);
    }


    private static move(path: string|AppPath)
    {
        let d = this.appDomlet;
        d = d.childByKey(this.rootKey);

        let pth = AppPath.toAppPath(path);
        this.currentPath = pth;

        if(pth == null)
        {
            this.land(d);
            return;
        }
        
        for(let i = 1; i < pth.segments.length; i++){
           d = this.land(d, pth.segments[i])
        }
        
        document.title = this.page_title + pth.toPath();
    }

    private static land(d: Domlet, segment: string = null)
    {
        if(d.appPartType() == AppPartType.navigation_switch)
        {
            let n = <SwitchDomlet> d;
            d = n.navigateContentDomlet(segment);
            
        }
        else if(d.appPartType() == AppPartType.navigation_menu)
        {
            let n = <MenuDomlet> d;
            d = n.navigateContentDomlet(segment);
        }
        else
        {
            d = d.childByKey(segment);
        }

        return d;
}

    public static hostPage(){
        let host = window.location.protocol + "//" + window.location.host;
        return host + "/" + this.pageName;
    }

    public static activePath(): AppPath{
        return this.currentPath;
    }

    
}