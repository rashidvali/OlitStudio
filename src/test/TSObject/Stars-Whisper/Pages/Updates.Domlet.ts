import { html } from "lit-html";
import { WeekCorouselDomlet } from "../../Domlets/WeekCorousel.Domlet";
import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";
import { Calendar } from "../../Models/DateTime/Calendar";
import { LanguageOption } from "../../Settings/LabelText";
import { DataType } from "../../Lib/Util/DataType";
import { Parcel } from "../../Alternative/Parcel";
import { TriggerType } from "../../Alternative/TriggerType";
import { MessageWire } from "../../Alternative/MessageWire";
import { CU_Signature } from "../../Alternative/CU_Signature";

export class UpdatesDomlet extends Domlet 
{
    public static readonly LANGUAGE_CHOICE = "Updates.LanguageChoice";

    constructor()
    {
        super();
        
        // get a child - week calendar
        var weekCorousel = this.childByKey("weekly-calendar");

        // wire the language choice into the child's input
        let langMsg = new MessageWire(LanguageOption, false, "UpdatesDomlet.InnerLang");
        this.plugDualFromInside(UpdatesDomlet.LANGUAGE_CHOICE, langMsg.init);
        weekCorousel.plugDual(WeekCorouselDomlet.LANGUAGE_CHOICE, langMsg.term);

        langMsg.Name = "INNER WIRE";
    }

    public template(): Domolit {
        return this.domolit({
            type: AppPartType.domolit,
            name: "Updates",
            children: [
                {
                    type: AppPartType.domlet,
                    key: "weekly-calendar",
                    class: WeekCorouselDomlet
                },
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <hr>
                    `
                },
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                    <div class="update-page">
                        <br>
                        <span style="font-size: 16pt; padding-left: 1.5rem;">
                            Доброго дня, Пётр
                        </span>
                        <p>
                            
                        </p>
                        <span style="font-size: 12pt; padding-left: 2.3rem;">
                            Сегодня
                        </span>
                        <p style="font-size: 10pt; padding-left: 0.5rem">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>         

                        <span style="font-size: 12pt; padding-left: 2.3rem;">
                            Июнь
                        </span>
                        <p style="font-size: 10pt; padding-left: 0.5rem">
                            Enim nunc faucibus a pellentesque sit amet. Amet aliquam id diam maecenas ultricies mi.
                        </p>

                        <span style="font-size: 12pt; padding-left: 2.3rem;">
                            2023
                        </span>
                        <p style="font-size: 10pt; padding-left: 0.5rem">
                            Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna. Urna nunc id cursus metus.
                        </p>

                        <br>

                    </div>
                    `
                }
            ]
        });
    }

   public cuSignature(): CU_Signature 
    {
        let cus: CU_Signature = {
            DualPorts: [
                { PortName: UpdatesDomlet.LANGUAGE_CHOICE, DataType: LanguageOption }
            ]
        };
    
        return cus;
    }
}