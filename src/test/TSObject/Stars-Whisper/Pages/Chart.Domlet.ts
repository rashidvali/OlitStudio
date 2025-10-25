import { html } from "lit-html";
import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";

export class ChartDomlet extends Domlet
{
    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            name: "Profile",
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                    <div class="chart-page">
                        <br>
                        <div class="d-flex justify-content-between">
                            <div class="left-img">
                                <img src="images/Astrological/astro/circle/circle1.png" alt="Table">
                            </div>
                            <div class="right-img">
                                <img src="images/Astrological/astro/table/table1.gif" alt="Circle">
                            </div>
                        </div>
                        <br>
                        <ul>
                            <div style="margin-left: 0.1rem; margin-bottom: 0.4rem; padding-left: 2rem; padding-right: 2rem; width: 88%; border: 1px solid #24a; ">
                                <li style="font-size: 14pt;">
                                    Реализация
                                </li>
                                <p style="font-size: 10pt;">Nibh mauris cursus mattis molestie a iaculis at</p>
                            </div>
                            <div style="margin-left: 0.1rem; margin-bottom: 0.4rem; padding-left: 2rem; padding-right: 2rem; width: 88%; border: 1px solid #24a; ">
                                <li style="font-size: 14pt;">
                                    Гармония
                                </li>
                                <p style="font-size: 10pt;">Metus dictum at tempor commodo ullamcorper a.</p>
                            </div>
                            <div style="margin-left: 0.1rem; margin-bottom: 0.4rem; padding-left: 2rem; padding-right: 2rem; width: 88%; border: 1px solid #24a; ">
                                <li style="font-size: 14pt;">
                                    Сферы жизни
                                </li>
                                <p style="font-size: 10pt;">Ut tellus elementum sagittis vitae et. Purus viverra accumsan in nisl.</p>
                            </div>
                        </ul>

                        <br>
                        
                    </div>
                    `
                }
            ]
        });
    }
}