import { html } from "lit-html";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domlet } from "../../Domoliter/Domlet";
import { Domolit } from "../../Domoliter/Domolit";

export class AppFooterDomlet extends Domlet
{
    public template(): Domolit {
        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                    <div data-name="footer"  class="fixed-bottom">
                        <!-- app-footer -->
                    </div>
                    `
                }
            ]
        });
    }
}