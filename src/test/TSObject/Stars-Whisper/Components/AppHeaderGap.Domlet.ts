import { html } from "lit-html";
import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";

export class AppHeaderGapDomlet extends Domlet
{
    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <div class="app-header-gap" >
                            
                        </div>
                    `
                }
            ]
        });
    }
}