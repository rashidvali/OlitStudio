import { SwitchDomlet } from "./Switch.Domlet";
import { AppRoute } from "../Navigation/AppRoute";
import { Domolit } from "../../Domoliter/Domolit";
import { AppPartType } from "../../Domoliter/AppPartType";
import { html } from "lit-html";
import { LanguageOption } from "../../Settings/LabelText";
import { HtmlTemplate } from "../../Graphics/Rendering/Display.h";
import { App } from "../App";
import { CU_Signature } from "../../Alternative/CU_Signature";
import { Num } from "../../Lib/TSExt/Num";
import { Parcel } from "../../Alternative/Parcel";
import { TriggerType } from "../../Alternative/TriggerType";

export class MenuDomlet extends SwitchDomlet
{
    public static readonly LANGUAGE_CHOICE = "Menu.LanguageChoice";
    private languageOption: LanguageOption;

    constructor(root: Node = null, id: string = null)
    {
        super(root, id)
    }

    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,                      
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <nav class="navbar navbar-expand justify-content-center navbar-dark menu shadow">
                            <div id="navbarNav" class="text-justify">
                                <ul class="navbar-nav">

                                    ${this.navigations()}

                                </ul>
                            </div>
                        </nav>

                    `
                },
                {
                    type: AppPartType.domolit,
                    key: "content-mount",
                    attributes: [{name: "data-name", value: "content-mount"}],  // just to make it visible in the source in a browser
                    id: this.mountId
                }
            ]
        });
    }

    public cuSignature(): CU_Signature 
    {
        let cus: CU_Signature = {
            DualPorts: [
                { PortName: MenuDomlet.LANGUAGE_CHOICE, DataType: LanguageOption }
            ]
        };

        return cus;
    }

    public navigations(): HtmlTemplate
    {
        let arr: HtmlTemplate = [];
        let dlg = (e: Event) => { this.navElementClickHandle(e); };

        this.routeMap.forEach(a => {
            let r = html`
            <li class="nav-item">
                <a class="nav-link" data-option-key=${a.key} @click=${dlg} id="${this.rootId() + '-navigatable-element-' + a.key}">
                    
                </a>
            </li>`;
            arr.push(r);
        });

        return arr;
    }

    protected applyDomolit(): void {
        // do nothing
    }

    public settleDomolit(){
        super.applyDomolit();
    }

    // used by DomletBuilder
    // public setOptionCaptions()
    public settleCaptions(routes: AppRoute[])
    {
        if(!!routes)
        {
            for(let r of routes){
                this.setNavElementCaption(this.getNavElement(r.key), r.key);
            }
        }
    }

    public setOptionCaptions(){
        this.settleCaptions(this.routs());
    }

    public navElementLabel(key: string)
    {
        let labelTextSet = this.labelSet(this.labelTextService, this.dataPrefix + key);
        
        switch(this.languageOption)
        {
            case LanguageOption.English: return labelTextSet.English;
            case LanguageOption.Russian: return labelTextSet.Russian;
            default: return labelTextSet.English;
        }
    }

    public process(): void
    {
        let rqstPrsl = this.dualGet(MenuDomlet.LANGUAGE_CHOICE);
        this.languageOption = <LanguageOption> Num.toInt(rqstPrsl.Value);
        this.setOptionCaptions();
    }

    public afterLoading(): void
    {
        let rqstPrsl = new Parcel();
        rqstPrsl.TriggerType = TriggerType.Request;
        this.fireDualExternally(MenuDomlet.LANGUAGE_CHOICE, rqstPrsl);
    }

    private setNavElementCaption(navElement: Element, key: string){
        navElement.innerHTML = this.navElementLabel(key); 
    }

    private navElementClickHandle(e: Event): void
    {
        let target: any = e.target;
        let key = target.getAttribute("data-option-key");
        this.navigateContentDomlet(key);

        let path = App.activePath();
        path.setLastSegment(key);
        App.updateBrowserHistory(path);
    }

    private getNavElement(optionKey: string): Element{
        let elementId = this.rootId() + '-navigatable-element-' + optionKey;
        return this.htmlElement().querySelector("#" + elementId);
    }

    public appPartType(): AppPartType{
        return AppPartType.navigation_menu;
    }
}