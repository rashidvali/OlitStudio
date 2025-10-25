import { DomletBuilder } from "../../Domoliter/DomletBuilder";
import { Domolit } from "../../Domoliter/Domolit";
import { AppPartType } from "../../Domoliter/AppPartType";
import { UserLoginDomlet } from "../../ArchtectInfra/AppEntry/UserLogin.Domlet";
import { AppHeaderDomlet } from "../Components/AppHeader.Domlet";
import { StarsWhisperData_LabelTextService } from "../Services/StarsWhisperData_LabelText.Service";
import { UpdatesDomlet } from "../Pages/Updates.Domlet";
import { ChartDomlet } from "../Pages/Chart.Domlet";
import { FriendsDomlet } from "../Pages/Friends.Domlet";
import { SettingsDomlet } from "../Pages/Settings.Domlet";
import { UserRegistrationDomlet } from "../../ArchtectInfra/AppEntry/UserRegistration.Domlet";
import { App } from "../../ArchtectInfra/App";
import { AppFooterDomlet } from "../Components/AppFooter.Domlet";
import { MainFooterDomlet } from "../Components/MainFooter.Domlet";
import { MainHeaderDomlet } from "../Components/MainHeader.Domlet";
import { AppHeaderGapDomlet } from "../Components/AppHeaderGap.Domlet";
import { Address, DbContext, Order, OrderDetail } from "../DataModel/DbContext";
import { Person } from "../../ω_NOT-IN-USE/Entity";
import { ModelFactory } from "../DataModel/ModelTree";
import { _query2 } from "../../Try/Query2";
import { Str } from "../../Lib/TSExt/Str";
import { Querier } from "../../DataProcess/Querier";
import { EQUALS, GREATER, IN, LIKE, _ } from "../../DataProcess/Functors";
import { MatrixDomlet } from "../Pages/Matrix.Domlet";
import { DataType } from "../../Lib/Util/DataType";
import { LanguageOption } from "../../Settings/LabelText";
import { MenuDomlet } from "../../ArchtectInfra/AppStructure/Menu.Domlet";
import { AppSetServer } from "../../ArchtectInfra/AppSetServer";
import { Side } from "../../Conn/Network/Side";
import { ChosenLanguageService } from "../Services/ChosenLanguage.Service";

/*
 *   Only the following AppPartType options are 
 *   allowed in AppStruct domolit template:
 *       AppPartType.domolit, 
 *       AppPartType.navigation_switch, 
 *       AppPartType.navigation_menu, 
 *       AppPartType.domlet
 */

const appFooterDomlet = new AppFooterDomlet();

export class StarsWhisperApp 
{
    private static rootKey = "app";
    public static init() 
    {
        let CORE_APP_SET_SERVER = "Core.AppSetServer";
        let CORE_APP_LANGUAGE = "Core.AppLanguage";
        let CORE_APP_CHOSEN_LANGUAGE1 = "Core.AppChosenLanguage1";
        let CORE_APP_CHOSEN_LANGUAGE2 = "Core.AppChosenLanguage2";
        let CORE_APP_CHOSEN_LANGUAGE3 = "Core.AppChosenLanguage3";

        // --- DOMOLIT ---
        let appStruct: Domolit = {
            key: "app-struct",
            type: AppPartType.domolit,
            name: "Stars Wisper",

            attributes: [
                { name: "class", value: "global" }
                // {name: "style", value: "background-color: red;"}
            ],

            messageWires: [
                {Type: DataType.string, Directed: false, Name: CORE_APP_SET_SERVER},
                { Type: LanguageOption, Directed: false, Name: CORE_APP_CHOSEN_LANGUAGE1 }, 
                { Type: LanguageOption, Directed: false, Name: CORE_APP_CHOSEN_LANGUAGE2 }, 
                { Type: LanguageOption, Directed: false, Name: CORE_APP_CHOSEN_LANGUAGE3 } 
            ],            

            services: [
                {
                    key: "app_chosen_language",
                    type: AppPartType.server,
                    class: ChosenLanguageService,
                    portConnectSignature: {
                        Duals: [
                            {
                                PortName: ChosenLanguageService.SERVICE_CHOSEN_LANG,
                                WireName: CORE_APP_CHOSEN_LANGUAGE1,
                                Side: Side.TERM
                            },
                            {
                                PortName: ChosenLanguageService.SERVICE_CHOSEN_LANG,
                                WireName: CORE_APP_CHOSEN_LANGUAGE2,
                                Side: Side.TERM
                            },
                            {
                                PortName: ChosenLanguageService.SERVICE_CHOSEN_LANG,
                                WireName: CORE_APP_CHOSEN_LANGUAGE3,
                                Side: Side.TERM
                            }

                        ]
                    }
                },
                {
                    key: "app_set_server",
                    type: AppPartType.server,
                    class: AppSetServer,
                    portConnectSignature:{
                        Duals: [
                            {PortName: AppSetServer.APP_SETTING_VALUE, WireName: CORE_APP_SET_SERVER,Side: Side.TERM}
                        ]
                    }
                }
                
            ],

            children: [
                { name: "Application Header", type: AppPartType.domlet, class: AppHeaderDomlet },
                { name: "Application Header Gap", type: AppPartType.domlet, class: AppHeaderGapDomlet },
                {
                    //name: "Application Main part",
                    key: this.rootKey,

                    name: "AppTemplate",
                    type: AppPartType.navigation_switch,
                    routes: [
                        {
                            key: "user-login",
                            path: "user-login",
                            isSingleton: false,
                            isDefault: true,
                            appPart: {
                                type: AppPartType.domlet,
                                class: UserLoginDomlet
                            }
                        },
                        {
                            key: "user-registration",
                            path: "user-registration",
                            isDefault: false,
                            appPart: {
                                type: AppPartType.domlet,
                                class: UserRegistrationDomlet
                            }
                        },
                        {
                            key: "main",
                            path: "main",
                            name: "MainTemplate",
                            isSingleton: false,
                            // isDefault: true,
                            appPart: {
                                type: AppPartType.domolit,
                                children: [
                                    {
                                        type: AppPartType.domlet,
                                        class: MainHeaderDomlet
                                    },
                                    {
                                        key: "menu",
                                        type: AppPartType.navigation_menu,
                                        name_data_prefix: "Star-Wisper.Common.Navbar.",
                                        options_data_service: StarsWhisperData_LabelTextService,
                                        portConnectSignature: {
                                            Duals: [
                                                {PortName: MenuDomlet.LANGUAGE_CHOICE, WireName: CORE_APP_CHOSEN_LANGUAGE2, Side: Side.INIT}
                                            ]                                                                                   
                                        },
                                        routes: [
                                            {
                                                key: "updates",
                                                path: "main/updates",
                                                isSingleton: true,
                                                // isDefault: true'
                                                appPart: {
                                                    type: AppPartType.domlet,
                                                    class: UpdatesDomlet,
                                                    portConnectSignature: {
                                                        Duals: [
                                                            {PortName: UpdatesDomlet.LANGUAGE_CHOICE, WireName: CORE_APP_CHOSEN_LANGUAGE3, Side: Side.INIT}
                                                        ]                                                    
                                                    } 
                                                }
                                            },
                                            {
                                                key: "chart",
                                                path: "main/chart",
                                                isSingleton: true,
                                                // isDefault: true,
                                                appPart: {
                                                    type: AppPartType.domlet,
                                                    class: ChartDomlet
                                                }
                                            },
                                            {
                                                key: "friends",
                                                path: "main/friends",
                                                isSingleton: true,
                                                // isDefault: true,
                                                appPart: {
                                                    type: AppPartType.domlet,
                                                    class: FriendsDomlet
                                                }
                                            },
                                            {
                                                key: "settings",
                                                path: "main/settings",
                                                isSingleton: true,
                                                appPart: {
                                                    type: AppPartType.domlet,
                                                    class: SettingsDomlet,
                                                    portConnectSignature: {
                                                        Duals: [
                                                            {PortName: SettingsDomlet.LANGUAGE_OPTION, WireName: CORE_APP_CHOSEN_LANGUAGE1, Side: Side.INIT}
                                                        ]                                                                                   
                                                    }
                                                },                                  
                                                isDefault: true,
                                            },
                                            {
                                                key: "matrix",
                                                path: "main/matrix",
                                                isSingleton: true,
                                                // isDefault: true,
                                                appPart: {
                                                    type: AppPartType.domlet,
                                                    class: MatrixDomlet
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        type: AppPartType.domlet,
                                        class: MainFooterDomlet
                                    },
                                ]
                            },
                        }
                    ]
                },
                {
                    name: "Application Footer",
                    type: AppPartType.domlet,
                    class: AppFooterDomlet
                }
            ],
        }
        
        DomletBuilder.build(null);
        /*
         * Without the line above it's getting very strange error:
         *   Uncaught ReferenceError ReferenceError: Cannot access 'Domlet' before initialization
         *       at Domlet (localhost꞉8086/bundle.js:1575:53)
         *       at ./src/ArchtectInfra/AppStructure/Switch.Domlet.ts (c:\Work\Projects\Domolite\src\ArchtectInfra\AppStructure\Switch.Domlet.ts:7:35)     
         *       ...
         */

        App.init(appStruct, this.rootKey);

        // let footer = new AppFooterDomlet();
        // DomNode.append(document.body, footer.dRoot());

        // -- Test zone --
        // this.testNavigate();
        // this.testInterfaceToJson(); // !!
        // this.testEntity1();
        // this.testEntity2();
        // this.testQuery1();
        // this.testQuery2();
        // this.testQuerier();
        // this.testPersonQuery1();
        // this.testPersonQuery2();
        // this.testMerge1();
    }


    //===================================================================================
    //===================================================================================
    //===================================================================================
    private static testNavigate() {
        let p: string;
        // p = "/user-registration";
        // p = "/main";
        // p = "/main/menu";
        // p = "/main/menu/updates";
        p = "/main/menu/settings";
        // p = "/main/menu/friends";

        App.navigate(p);
    }

    private static testInterfaceToJson() {
        // let db = DbContext
        // console.log(db);

        // console.log("\n");

        let dbc = DbContext;
        console.log(dbc);

        // let str = JSON.stringify(DbContext);
        // let json = JSON.parse(DbContext);
        // console.log(json);


    }

    private static testEntity1() {
        let p1 = ModelFactory();
        let js1 = JSON.stringify(p1);

        // console.log(p1);
        console.log(js1);


        // let p2 = ModelFactory(false);
        // console.log(p2);

        // let js2 = JSON.stringify(p2);
        // console.log(js2);

        // console.log(typeof p1.Person);

    }

    private static testEntity2() {
        let p1 = ModelFactory(false);
        let p21 = Object.create(p1);

        let p22 = Object.create(p1.Person);

        let a1 = Object.create(p1.Person.Address);


        console.log(p1);

    }

    private static testQuery1() {
        let o = _query2();
        let st = JSON.stringify(o);
        let js = JSON.parse(st);
        let f = _query2;
        let q = Str.getInner(f.toString(), "let query =", "return query;");
        q = q.trim();
        q = Str.trimTail(";", q);

        q = JSON.stringify(q);
        q = JSON.parse(q);
        // console.log(q3);

        console.log(q);
        console.log(st);


        //-- replace [,] in strings (double quoted) with [<+>]
    }

    private static testQuery2() {
        let q = `
        {
            "select": [
                "p.FirstName", "p.LastName",
                [
                    "a.City", "a.State"
                ],
                [
                    "o.OrderNumber", "o.Amount"
                ]
            ],
            "where": [
                "p.FirstName = \"John\"", "p.LastName = \"McCarty\"",
                [
                    "o.Amount = 100", "o.Currency = \"USD\""
                ]
            ]
        }        
        `;

        let q1 = JSON.stringify(q);

        // q = Str.replace(q, "\n", "");
        let q2 = JSON.parse(q1);
        console.log(q2);

    }

    private static testQuerier() {
        let st = _query2.toString();
        let q = Querier.parse(st)
        console.log(q);

    }

    private static testPersonQuery1() {
        let q = {
            Person: <Person>{
                FirstName: _ + EQUALS("John"),
                LastName: _ + LIKE("%Son%"),
                Id: GREATER(0),
                HomeAddress: {
                    City: _,
                    State: _,
                    ZIP: IN("98052", "98007", "98005")
                },
                SalesOrder: [
                    {
                        OrderNumber: _ + EQUALS(105),
                        Amount: EQUALS(100)
                    }
                ]
            }
        };

        console.log(q);
        console.log();

        let j = JSON.stringify(q);
        console.log(j);
        console.log();

        let o = JSON.parse(j);
        console.log(o);
    }

    private static testPersonQuery2() {
        let q = {
            Person: <Person>{
                FirstName: _ + LIKE("J%"),
                LastName: _ + LIKE("%m%"),
                Id: GREATER(0),
                HomeAddress: <Address>{
                    City: _,
                    State: _
                },
                SalesOrder: <Order>{
                    OrderNumber: "_ IN ('SO71772', 'SO71774')",
                    Amount: "_",
                    Currency: "_"
                }
            }
        };

        console.log(q);
        console.log();

        let j = JSON.stringify(q);
        console.log(j);
        console.log();

        let o = JSON.parse(j);
        console.log(o);
    }

    private static testMerge1() {
        let q = {
            Person: <Person>{
                FirstName: "Bill",
                LastName: "Taiker",
                HomeAddress: {
                    Street: "Pip Street",
                    Apartment: "AB236",
                    City: "Renton",
                    State: "Washington",
                    ZIP: "99002"
                },
                WHERE: <Person>{
                    FirstName: _ + LIKE("J%"),
                    LastName: _ + LIKE("%m%"),
                    Id: GREATER(0),
                    HomeAddress: <Address>{
                        City: _,
                        State: _
                    },
                    SalesOrder: <Order>{
                        OrderNumber: "_ IN ('SO71772', 'SO71774')",
                        Amount: "_",
                        Currency: "_",
                        OrderDetails: <OrderDetail>{
                            OrderQty: 111,
                            WHERE: {

                            }
                        }
                    }
                }
            }
        }
    }

}