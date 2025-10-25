import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";
import { html } from "lit-html";


export class FriendsDomlet extends Domlet
{
    public template(): Domolit 
    {        
        return this.domolit({
            type: AppPartType.domolit,
            name: "Friends",
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <br>
                        <h2>Friends</h2>
                        <br>
                        <input type="text" value="7">
                    `
                }
            ]
        });
    }
}