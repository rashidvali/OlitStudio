import { html } from "lit-html";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domlet } from "../../Domoliter/Domlet";
import { Domolit } from "../../Domoliter/Domolit";
import { LanguageOption } from "../../Settings/LabelText";
import { HtmlTemplate } from "../../Graphics/Rendering/Display.h";
import { Num } from "../../Lib/TSExt/Num";
import { Parcel } from "../../Alternative/Parcel";
import { HtmlInputRadioBin } from "../../HtmlElementBin/HtmlInputRadioBin";
import { DataType } from "../../Lib/Util/DataType";
import { TriggerType } from "../../Alternative/TriggerType";
import { Obj } from "../../Lib/TSExt/Obj";
import { CU_Signature } from "../../Alternative/CU_Signature";
import { BinCU } from "../../Alternative/BinCU";
import { MessageWire } from "../../Alternative/MessageWire";

export class SettingsDomlet extends Domlet
{
    public static readonly LANGUAGE_OPTION = "Settings.LanguageOption";
    private static LANGUAGE_SWITCH = "LanguageSwitch";

    private languageRadioBin: HtmlInputRadioBin;
    private langBinCU: BinCU;

    constructor()
    {
        super();

        let langSwitch = <RadioNodeList> <NodeList> this.htmlElement().querySelectorAll(`[name="${SettingsDomlet.LANGUAGE_SWITCH}"]`);
        this.languageRadioBin = new HtmlInputRadioBin(langSwitch);          

        this.languageRadioBin.setOnchange(() => { 
            this.handleLangInput();
        });

        // this.languageRadioBin.setOninput(() => { 
        //     this.handleLangInput();
        // });
    }

    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            name: "Settings",
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <br>
                        <h3>Settings</h3>
                        <br>
                        <input type="text" value="SET">
                    `
                },
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <br>
                        <form>

                            <legend>Select language:</legend>

                            <fieldset id="${this.rootId() + '-language-choice-container'}">
                                ${ this.radioOption() }
                            </fieldset>

                        </form>
                        <br>
                    `
                }
            ]
        });
    }

    public cuSignature(): CU_Signature 
    {
        let cus: CU_Signature = {
            DualPorts: [
                { PortName: SettingsDomlet.LANGUAGE_OPTION, DataType: LanguageOption }
            ]
        };
    
        return cus;
    }

    public afterLoading(): void 
    {
        let rqstPrsl = new Parcel();
        rqstPrsl.TriggerType = TriggerType.Request;
        this.fireDualExternally(SettingsDomlet.LANGUAGE_OPTION, rqstPrsl);
    }   

    public process(): void {
        let langPrcel = this.dualGet(SettingsDomlet.LANGUAGE_OPTION);
        this.languageRadioBin.set(langPrcel);
    }

    private handleLangInput()
    {
        let value = this.languageRadioBin.getValue();
        let languageOption = <LanguageOption> Num.toInt(value);
        let langParcel = new Parcel(languageOption);
        langParcel.Type = LanguageOption;
        langParcel.TriggerType = TriggerType.Push;
        this.fireDualExternally(SettingsDomlet.LANGUAGE_OPTION, langParcel);
    }

    private radioOption():HtmlTemplate
    {
        let k = Object.keys(LanguageOption);
        k = k.slice(0, k.length/2);

        return k.map(l => html`
            <div>
                <input type="radio" id="${l}" name="${SettingsDomlet.LANGUAGE_SWITCH}" value="${l}" @change=${() => { this.chooseLang(Num.toNum(l)); }} ?checked=${this.isChoice(Num.toNum(l))}>
                <label for="${LanguageOption[Num.toNum(l)]}">${LanguageOption[Num.toNum(l)]}</label>
            </div>
        `);
    }

    private chooseLang(languageOption: number){
        let trsf: Parcel = new Parcel(languageOption);
        trsf.Type = LanguageOption;

        this.languageRadioBin.set(trsf);

    }

    private isChoice(ordinal: number): boolean{
        return this.languageRadioBin?.get().Value == ordinal;
    }
}