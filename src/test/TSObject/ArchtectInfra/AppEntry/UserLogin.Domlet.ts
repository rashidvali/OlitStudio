import { Domlet } from "../../Domoliter/Domlet";
import { html } from "lit-html";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";
import { App } from "../App";
import { ModalPopUpDomlet } from "../Forms/ModelPopUp.Domlet";
import { Caller } from "../../Server/axios/Caller";

export class UserLoginDomlet extends Domlet
{
    private dataNavigationKey = "user-login";
    
    private usernameInputElement: HTMLInputElement;
    private passwordInputElement: HTMLInputElement;
    private passwordToggleElement: HTMLElement;
    private isPasswordHidden = true;
    private modalPopIdUp: string;

    public template(): Domolit 
    {
        this.modalPopIdUp = `${this.rootId()}-login-modal-pop_up`;

        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                    <div class="user-credentials">
                        <div>
                            <div class="row gx-3 button-div">
                                <div class="row g-3 left-margine-1">
                                    <div class="col-1">
                                        <label for="login-username" class="col-sm-2 col-form-label web-visual">Username</label>
                                    </div>
                                    <div class="col-auto">
                                        <label for="login-username" class="col-sm-2 col-form-label mobile-visual">Username</label>
                                        <input type="text" class="form-control" id="${this.rootId()}-login-username" placeholder="Username"  value="ra">
                                    </div>
                                </div>

                                <div class="row g-3 left-margine-1">
                                    <div class="col-1">
                                        <label for="login-password" class="col-sm-2 col-form-label web-visual">Password</label>
                                    </div>
                                    <div class="col-auto">
                                        <label for="login-password" class="col-sm-2 col-form-label mobile-visual">Password</label>
                                        <div class="input-group mb-3">
                                            <!-- <span class="input-group-text">
                                                <i class="fas fa-lock"></i>
                                            </span> -->
                                            <input type="password" class="form-control" placeholder="Password" id="${this.rootId()}-login-password" value="abc">
                                            <span class="input-group-text" @click="${() => { this.togglePassword(); }}" >
                                                <i class="far fa-eye" id="${this.rootId()}-login-togglePassword"></i> 
                                            </span>
                                        </div>                            
                                    </div>
                                </div>
                                
                                <div class="row g-3 left-margine-2 under-button">
                                    <div class="col-auto">
                                        <button @click="${() => { this.authenticateUser(); } }" class="btn btn-primary btn-lg mb-3">
                                            Sign in
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <br>

                            <div class="row gx-3 button-div">
                                <div class="row g-3 left-margine-2 under-button">
                                    <div class="col-auto">
                                        <button @click="${() => { App.navigate("/user-registration"); } }" class="btn btn-secondary  mb-3">
                                            Sign up
                                        </button>


                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#${this.modalPopIdUp}">
                                            Open modal 1
                                        </button>

                                        <button type="button" class="btn btn-primary" @click="${() => { this.openModalPopUpDialog(); }}">
                                            Open modal 2
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                            
                            <a @click="${() => { App.navigate("/main/menu/settings"); } }">
                                Settings
                            </a>
                            <br><br>
                            <button type="button" class="btn btn-primary" @click="${() => { Caller.MakeDbContext(); }}">
                                DbContext
                            </button>

`
                },
                {
                    key: "ModalPopUp",
                    type: AppPartType.domlet,
                    class: ModalPopUpDomlet,
                    methods: [
                        {name: "setIds", values: [`${this.modalPopIdUp}`]},
                        {name: "setCaption", values: ["Login failed"]},
                        {name: "setMessage", values: ["Username/password combination is wrong"]}
                    ]
                }
            ]
        });
    }

    private usernameInput(): HTMLInputElement
    {
        if(!this.usernameInputElement){
            this.usernameInputElement = <HTMLInputElement> document.getElementById(`${this.rootId()}-login-username`);
        }

        return this.usernameInputElement;
    }

    private passwordInput(): HTMLInputElement
    {
        if(!this.passwordInputElement){
            this.passwordInputElement = <HTMLInputElement> document.getElementById(`${this.rootId()}-login-password`);
        }

        return this.passwordInputElement;
    }

    // private preentry()
    // {
    //     this.usernameInput().value = "ra";
    //     this.passwordInput().value = "abc";
    // }

    private passwordToggle(): HTMLElement
    {
        if(!this.passwordToggleElement){
            this.passwordToggleElement = document.getElementById(`${this.rootId()}-login-togglePassword`);
        }

        return this.passwordToggleElement;
    }

    private togglePassword()
    {
        let cls = this.passwordToggle().classList;

        this.isPasswordHidden = !this.isPasswordHidden; 
        if(this.isPasswordHidden)
        {
            this.passwordInput().type = "password";
            this.passwordToggle().classList.replace("fa-eye-slash", "fa-eye");
        }
        else
        {
            this.passwordInput().type = "text";
            this.passwordToggle().classList.replace("fa-eye", "fa-eye-slash");
        }
    }

    private authenticateUser()
    {
        let username = this.usernameInput().value;
        let password = this.passwordInput().value;

        Caller.userSignIn(username, password);
    }

    public openModalPopUpDialog()
    {
        let dialog = <ModalPopUpDomlet> this.childByKey("ModalPopUp");
        dialog.open();
    }
}