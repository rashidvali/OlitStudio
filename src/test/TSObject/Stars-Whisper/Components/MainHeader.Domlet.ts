import { html } from "lit-html";
import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";

export class MainHeaderDomlet extends Domlet
{
    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <div class="main-header">
                            <table>
                                <tr>
                                    <td>
                                        <div class="left-spot">
                                            <span class="card-text">Saint Peter</span>                                
                                            <h5 class="card-title">♋︎ ♓︎ ♐︎ ♌︎</h5>
                                        </div>
                                    </td>
                                    <td width="100%"></td>
                                    <td>
                                        <div class="right-spot profile-photo" >
                                            <img src="images/Personal/Saida&Peter.JPG" alt="Saint Peter" class="rounded-circle">
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    `
                }
            ]
        });
    }
}