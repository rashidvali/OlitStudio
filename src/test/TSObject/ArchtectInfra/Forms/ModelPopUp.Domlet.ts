import { html } from "lit-html";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domlet } from "../../Domoliter/Domlet";
import { Domolit } from "../../Domoliter/Domolit";

export class ModalPopUpDomlet extends Domlet
{
    private modalId: string;

    public template(): Domolit 
    {
        return this.domolit({
            type:AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`  

                    <!-- The Modal -->
                    <div class="modal" data-id="modal-popup-main">
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h3 class="modal-title" style="color: orange; font-weight: bold;">
                                        <span id="local-heading-id">
                                            Modal Heading
                                        </span>
                                    </h3>
                                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal"></button> -->
                                    <button type="button" class="btn-close" @click="${() => { this.close(); }}"></button>
                                </div>

                                <!-- Modal body -->
                                <div class="modal-body"  style="color: red;">
                                    <h5>
                                        <span id="local-body-id">
                                            Modal body..
                                        </span>
                                    </h5>
                                </div>

                                <!-- Modal footer -->
                                <!-- <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                </div> -->

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" @click="${() => { this.close(); }}">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                }
            ]
        });
    }

    public afterBuild(): void {
        let mod = this.htmlElement().querySelector('[data-id]');
    }

    public setIds(id: string)
    {
        this.modalId = id;
        
        let mod = this.htmlElement().querySelector('[data-id]');
        mod.id = id;

        let caption = this.htmlElement().querySelector('#local-heading-id');
        caption.id = id + "-caption";

        let message = this.htmlElement().querySelector('#local-body-id');
        message.id = id + "-message";
    }

    public setCaption(caption: string)
    {
        let captionSpan = <HTMLSpanElement> this.htmlElement().querySelector("#" + this.modalId + "-caption");
        captionSpan.innerHTML = caption;
    }

    public setMessage(message: string)
    {
        let messageSpan = <HTMLSpanElement> this.htmlElement().querySelector("#" + this.modalId + "-message");
        messageSpan.innerHTML = message;
    }
    public open()
    {
        let mod = <HTMLDivElement> this.htmlElement().querySelector("#" + this.modalId);
        mod.classList.add("show");
        mod.style.display = 'block'
        mod.setAttribute("aria-modal", "true");
        mod.setAttribute("role","dialog");
    }

    public close()
    {
        let mod = <HTMLDivElement> this.htmlElement().querySelector("#" + this.modalId);
        mod.classList.remove("show");
        mod.style.display = 'none';
        mod.setAttribute("aria-hidden", "true");
    }
}