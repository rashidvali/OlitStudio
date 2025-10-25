import { render } from "../../node_modules/lit-html/lit-html";
import { VG } from "../Const/VG";
import { Obj } from "../Lib/TSExt/Obj";
import { Str } from "../Lib/TSExt/Str";
import { Domlet } from "./Domlet";
import { AppPartType } from "./AppPartType";
import { Domolit } from "./Domolit";
import { MenuDomlet } from "../ArchtectInfra/AppStructure/Menu.Domlet";
import { SwitchDomlet } from "../ArchtectInfra/AppStructure/Switch.Domlet";
import { App } from "../ArchtectInfra/App";
import { CU } from "../Alternative/CU";
import { MessageWire } from "../Alternative/MessageWire";
import { Side } from "../Conn/Network/Side";
import { PortConnectSignature, PortHubConnectSignature } from "../Alternative/PortHubConnectSignature";
import { Flow } from "../Syne/Flow";


export class DomletBuilder
{

    public static make(template: any): Domlet
    {
        if(!template){
            return null;
        }

        return this.build(new template());
    }

    public static build(domolit: Domolit, id: string = null): Domlet
    {
        if(Obj.isEmpty(domolit) || Obj.isEmpty(domolit.type)){
            return null;
        }

        let domlet: Domlet = null; 
        
        switch(domolit.type)
        {
            case AppPartType.domolit:
            {
                if(Str.isStringEmpty(id)){
                    id = domolit.id;
                }
        

                domlet = new Domlet(null, id);

                this.buildInDomlet(domolit, domlet);
                
            }break;

            case AppPartType.navigation_switch:
            {
                let nav = new SwitchDomlet();
                nav.settleRoutes(domolit.routes);
                nav.navigateContentDomlet();  
                domlet = nav;
            }break;

            case AppPartType.navigation_menu:
            {
                let nav = new MenuDomlet();
                nav.labelTextService = domolit.options_data_service;
                nav.dataPrefix = domolit.name_data_prefix;
                nav.settleRoutes(domolit.routes); 
                nav.settleDomolit();
                nav.settleCaptions(domolit.routes);
                nav.navigateContentDomlet();  
                domlet = nav;
                
            }break;

            case AppPartType.domlet:
            {
                domlet = <Domlet> new domolit.class();
        
                let domletName = domolit.class.name;
                domlet.name = domletName;
                domlet.rootElement().setAttribute("data-domlet-name", domletName);
                
            }break;

            case AppPartType.html_template:
            {
                domlet = new Domlet();
                // (<HTMLElement> dml.dRoot()).innerHTML = domolit.inner_html;
                
                render(domolit.inner_html, domlet.htmlElement());

            }break;

            case AppPartType.html_element:
            {
                let elm = document.createElement(domolit.element); // new template.class();
                domlet = new Domlet(elm);

                if(!Obj.isEmpty(domolit.attributes)){
                    for(let a of domolit.attributes){
                        elm.setAttribute(a.name, a.value);                        
                    }
                }

                if(!Obj.isEmpty(domolit.children))
                {                    
                    for(let ct of domolit.children)
                    {
                        let c = this.build(ct);
                        domlet.addChild(c);
                    }
                }
                
            }break;

            case AppPartType.svg_element:
            {
                let elm = document.createElementNS(VG.SVG_NS, domolit.element); // new template.class();

                if(!Obj.isEmpty(domolit.attributes)){
                    for(let a of domolit.attributes){
                        elm.setAttribute(a.name, a.value);                    
                    }
                }

                if(!Obj.isEmpty(domolit.ns_attributes)){
                    for(let a of domolit.ns_attributes){
                        elm.setAttributeNS(a.namespace, a.name, a.value);
                    }
                }

                domlet = new Domlet(elm);
                
            }break; 
        }

        this.conectCU(domlet, domolit);
        
        if(domolit.key == "app-struct"){
            this.seattleMessageWires(domolit, App.dMsgWr, App.uMsgWr);
        }

        if(domolit.services != null)
        {
            for(let d of domolit.services)
            {
                let c = <CU> new d.class();
                
                c.name = d.class.name;
                c.key = d.key;

                this.conectCU(c, d);
                domlet.Services.set(c.key, c);
            }
        }
      
        if(domlet != null)
        {
            let elm = <any> domlet.dRoot();
                    
            if(!Obj.isEmpty(domolit.attributes)){
                for(let a of domolit.attributes){
                    elm.setAttribute(a.name, a.value);                    
                }
            }

            if(!Obj.isEmpty(domolit.ns_attributes)){
                for(let a of domolit.ns_attributes){
                    elm.setAttributeNS(a.namespace, a.name, a.value);
                }
            }

            if(!Obj.isEmpty(domolit.methods))
            {
                let obj = <any> domlet;
                for(let method of domolit.methods){
                    obj[method.name](...method.values);
                }
            }

            if(Str.isStringValid(domolit.key))
            {
                domlet.key = domolit.key;
                elm.setAttribute("data-domlet-key", domolit.key);
            }

            if(domolit.type != AppPartType.navigation_switch && Str.isStringValid(domolit.name))
            {
                domlet.name = domolit.name;
                elm.setAttribute("data-domlet-name", domolit.name);
            }
        }
        
        return domlet;
    }

    private static seattleMessageWires(domolit: Domolit, dMsgWr: Map<string, MessageWire>, uMsgWr: Map<string, MessageWire>)
    {
        if(!Obj.isEmpty(domolit.messageWires))
        {
            for(let m of domolit.messageWires)
            {
                let mw = new MessageWire(m.Type, m.Directed, m.Name);

                if(m.Directed) {
                    dMsgWr.set(m.Name, mw);
                }
                else{
                    uMsgWr.set(m.Name, mw);
                }
            }
        }
    }

    private static conectCU(c: CU, d: Domolit): CU
    {
        if(!Obj.isEmpty(d.portConnectSignature))
        {
            let phs = d.portConnectSignature;

            this.connectToCUPorts(phs.Inputs, c, Flow.INPUT);
            this.connectToCUPorts(phs.Outputs, c, Flow.OUTPUT);
            this.connectToCUPorts(phs.Duals, c, Flow.DUAL);
        }

        return c;
    }

    private static connectToCUPorts(ps: PortConnectSignature[], c: CU, flow: Flow)
    {
        if(!Obj.isEmpty(ps))
            {
                for(let p of ps)
                {
                    if (flow == Flow.DUAL)
                    {
                        let wire = App.uMsgWr.get(p.WireName);
                        let plug = wire.getPlug(p.Side);
                        c.plugDual(p.PortName, plug);
                    }
                    else
                    {
                        let wire = App.dMsgWr.get(p.WireName);
                        let plug = wire.getPlug(p.Side);

                        switch(flow)
                        {
                            case Flow.INPUT:
                                c.plugIn(p.PortName, plug);
                                break;

                            case Flow.OUTPUT:
                                c.plugOut(p.PortName, plug);
                                break;

                        }                    
                    }
                }
            }
    }

    public static makeInDomlet(template: any, domlet: Domlet):void{
        this.buildInDomlet(new template(), domlet);
    }

    public static buildInDomlet(domolit: Domolit, domlet: Domlet):void
    {
        if(Obj.isEmpty(domlet)){
            return;
        }

        // let obj = <any> domlet;

        let elm = domlet.dRoot();

        if(!Obj.isEmpty(domolit.children))
        {                    
            for(let ct of domolit.children)
            {
                let c = <Domlet> this.build(ct);
                domlet.addChild(c);
            }
        }
    }
}