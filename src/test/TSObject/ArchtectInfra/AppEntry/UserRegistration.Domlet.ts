import { html } from "lit-html";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domlet } from "../../Domoliter/Domlet";
import { Domolit } from "../../Domoliter/Domolit";
import { App } from "../App";

export class UserRegistrationDomlet extends Domlet
{
    private dataNavigationKey = "user-login"
    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    attributes: [
                        {name: "data-part-name", value: "template"}
                    ],
                    inner_html: html`
                        <h1>User Registration</h1>
                        <a @click="${() => { App.navigate("/user-login"); } }">
                            User Login
                        </a>
                    `
                }
            ]
        });
    }
}