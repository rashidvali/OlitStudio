import { LabelTextSet } from "../Settings/LabelText";
import { Num } from "../Lib/TSExt/Num";
import { Obj } from "../Lib/TSExt/Obj";
import { Str } from "../Lib/TSExt/Str";
import { DomletBuilder } from "./DomletBuilder";
import { Domolit } from "./Domolit";
import { AppPartType } from "./AppPartType";
import { Executor } from "../Lib/Util/Executor";
import { CU } from "../Alternative/CU";

export class Domlet extends CU
{
    private static counter = 0;

    private _template: Domolit = null;

    public static count(): string{
        // return "#domlet" + Num.intDString(this.counter++);
        return "domlet" + Num.intDString(this.counter++, 5);
    }

    public static assignDomletToNode(node: Node, domlet: Domlet):void{
        (<any> node).cobj = this;
        // (<Element> node).setAttribute("data-part", "domlet-class");
    }

    public static getDomletFromNode(node: Node): Domlet{
        return (<any> node).cobj;
    }

    public parent: Domlet;

    public readonly Services = new Map<string, CU>();


    private root: Node;
    private _keyedChildren = new Map<string, Domlet>();
    private _unkeyedChildren = new Array<Domlet>();
    protected isLoaded = false;

    constructor(root: Node = null, id: string = null)
    {
        super();

        if(root != null){
            this.root = root;
        }
        else{
            let d = document.createElement("div");
            this.root = d;
        }

        (<any> this.root).id = Str.isStringEmpty(id) ? Domlet.count() : id; 

        Domlet.assignDomletToNode(this.root, this); 

        this.applyDomolit();
    }

    protected applyDomolit(): void 
    {
        let dml = this.template();
        if(dml != null){
            DomletBuilder.buildInDomlet(dml, this);
        }

        this.afterBuild();
    }

    public afterBuild(){
        //do nothing - abstract
    }

    public afterLoading():void{
        // do nothing - abstract
    }

    public rootId():string{
        return (<any> this.root).id;
    }

    /**
     * 
     * @returns Returns element DOM node
     */
    public dRoot(): Node {
        return this.root;
    }

    public htmlElement(): HTMLElement{
        return <HTMLElement> this.root;
    }

    public rootElement(): Element{
        return <Element> this.root;
    }

    public mapChild(key: string, domlet: Domlet)
    {
        if(Str.isStringEmpty(key) || Obj.isEmpty(domlet)){
            return;
        }

        this._keyedChildren.set(key, domlet);
    }

    public childByKey(key: string): Domlet{
        return this._keyedChildren.get(key);
    }

    public unmapChild(key: string):Domlet
    {
        let domlet = this._keyedChildren.get(key);
        this._keyedChildren.delete(key);
        return domlet;
    }

    public logChild(domlet: Domlet)
    {
        if(Obj.isEmpty(domlet)){
            return;
        }

        this._unkeyedChildren.push(domlet);
    }

    public keyedChildren(): Map<string, Domlet>{
        return this._keyedChildren;
    }

    public unkeyedChildren(): Array<Domlet>{
        return this._unkeyedChildren;
    }

    protected domolit(template: Domolit):Domolit
    {
        if(Obj.isEmpty(template)){
            return this._template;
        }
        else{
            this._template = template;
            return template;
        }
    }

    public template(): Domolit{
        //abstract
        return {};
    }

    public labelSet(srv: any, key:string|number):LabelTextSet{
        return srv.optionLabel(key);
    }

    public appPartType(): AppPartType{
        return AppPartType.domlet;
    }

    public addChild(child: Domlet): Node
    {
        if(Obj.isEmpty(child)){
            return null;
        }

        child.parent = this;

        if(Str.isStringValid(child.key)){
            this.mapChild(child.key, child);
        }
        else{
            this.logChild(child);
        }

        let res = this.dRoot().appendChild(child.dRoot());        

        if(this.isLoaded && !child.isLoaded){
            child.triggerAfterLoadingEvent();
        }

        return res;
    }

    public replaceChild(child: Domlet, old: Domlet): Node
    {
        if(Obj.isEmpty(child) || Obj.isEmpty(old)){
            return null;
        }

        let wasRemoved = false;
        if(Str.isStringValid(old.key))
        {
            if(this._keyedChildren.has(old.key))
            {
                this._keyedChildren.delete(old.key);
                wasRemoved = true;
            }
        }

        if(!wasRemoved)
        {
            let ind = this._unkeyedChildren.indexOf(old);
            this._unkeyedChildren.splice(ind);
        }

        if(Str.isStringValid(child.key)){
            this.mapChild(child.key, child);
        }
        else{
            this.logChild(child);
        }

        let res = this.dRoot().replaceChild(child.dRoot(), old.dRoot());

        if(this.isLoaded && !child.isLoaded){
            child.triggerAfterLoadingEvent();
        }

        return res;
    }

    public triggerAfterLoadingEvent()
    {
        this.isLoaded = true;

        Executor.run(
            () => {
                this.afterLoading();
            }
        )        

        for(let v of this._keyedChildren.values()){
            v.triggerAfterLoadingEvent();
        }

        for(let v of this._unkeyedChildren){
            v.triggerAfterLoadingEvent();
        }
    }
}