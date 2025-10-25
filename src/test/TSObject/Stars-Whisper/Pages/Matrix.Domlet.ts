import { html } from "lit-html";
import { Domlet } from "../../Domoliter/Domlet";
import { AppPartType } from "../../Domoliter/AppPartType";
import { Domolit } from "../../Domoliter/Domolit";
import { Obj } from "../../Lib/TSExt/Obj";
import { Parcel } from "../../Alternative/Parcel";
import { DataType } from "../../Lib/Util/DataType";
import { TriggerType } from "../../Alternative/TriggerType";
import { MessageWire } from "../../Alternative/MessageWire";
import { HtmlBinCUBuilder } from "../../HtmlElementBin/HtmlelementBase/HtmlBinCUBuilder";
import { MessageBus } from "../../Alternative/MessageBus";
import { MessageWireJunction } from "../../Alternative/MessageWireJunction";
import { Flow } from "../../Syne/Flow";
import { SumCU } from "../../MathProcess/SumCU";
import { AppSetServer } from "../../ArchtectInfra/AppSetServer";

var l0: HTMLSpanElement;
var l1: HTMLSpanElement;
var l2: HTMLSpanElement;
var l3: HTMLSpanElement;

var 
    t0: HTMLInputElement, t1: HTMLInputElement, t2: HTMLInputElement, t3: HTMLInputElement, t4: HTMLInputElement, 
    t5: HTMLInputElement, t6: HTMLInputElement, t7: HTMLInputElement, t8: HTMLInputElement, t9: HTMLInputElement,
    t10: HTMLInputElement,t11: HTMLInputElement,t12: HTMLInputElement,t13: HTMLInputElement,t14: HTMLInputElement,
    t15: HTMLInputElement,t16: HTMLInputElement,t17: HTMLInputElement,t18: HTMLInputElement,t19: HTMLInputElement;

var
    t_term1: HTMLInputElement, t_term2: HTMLInputElement, t_res: HTMLInputElement



export class MatrixDomlet extends Domlet 
{
    public afterLoading(): void 
    {
        this.getInputContols();

        // this.testConnect(); // --OK
        // this.testConnect2(); // --OK

        // this.testBinCU1(); // --OK
        // this.testBus(); // --OK
        // this.testConnectJunction(); // --OK
        // this.testSumCU(); // --OK

        this.testAppSetServer(); // --OK
        // this.testAppSetServer2(); // --OK
        // this.testAppSetServer3(); // --OK

        // this.testAppSetServer4(); // --OK
    }

    private getInputContols():void
    {
        l0 = <HTMLSpanElement> document.getElementById("lbl-id-0");
        l1 = <HTMLSpanElement> document.getElementById("lbl-id-1");
        l2 = <HTMLSpanElement> document.getElementById("lbl-id-2");
        l3 = <HTMLSpanElement> document.getElementById("lbl-id-3");

        t0= <HTMLInputElement> document.getElementById("cell-id-0"),  t1= <HTMLInputElement> document.getElementById("cell-id-1"),  
        t2= <HTMLInputElement> document.getElementById("cell-id-2"),  t3= <HTMLInputElement> document.getElementById("cell-id-3"),  
        t4= <HTMLInputElement> document.getElementById("cell-id-4"),  t5= <HTMLInputElement> document.getElementById("cell-id-5"),  
        t6= <HTMLInputElement> document.getElementById("cell-id-6"),  t7= <HTMLInputElement> document.getElementById("cell-id-7"),  
        t8= <HTMLInputElement> document.getElementById("cell-id-8"),  t9= <HTMLInputElement> document.getElementById("cell-id-9");

        t10= <HTMLInputElement> document.getElementById("cell-id-10"),  t11= <HTMLInputElement> document.getElementById("cell-id-11"),  
        t12= <HTMLInputElement> document.getElementById("cell-id-12"),  t13= <HTMLInputElement> document.getElementById("cell-id-13"),  
        t14= <HTMLInputElement> document.getElementById("cell-id-14"),  t15= <HTMLInputElement> document.getElementById("cell-id-15"),  
        t16= <HTMLInputElement> document.getElementById("cell-id-16"),  t17= <HTMLInputElement> document.getElementById("cell-id-17"),  
        t18= <HTMLInputElement> document.getElementById("cell-id-18"),  t19= <HTMLInputElement> document.getElementById("cell-id-19");

        t_term1 = <HTMLInputElement> document.getElementById("cell-id-term1");
        t_term2 = <HTMLInputElement> document.getElementById("cell-id-term2");
        t_res = <HTMLInputElement> document.getElementById("cell-id-t_res");
    }

    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            attributes: [{ name: "data-name", value: "settings-outer-container" }],
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        <br>
                        <h2>Matrix</h2>
                        <input type="text" value="">
                        <br>
                        <hr>

                        <br>
                        <div class="container">
                            <div class="row">
                                <div class="col-sm">
                                    <span id="lbl-id-0"></span>
                                    <span id="lbl-id-1"></span>
                                </div>
                                <div class="col-sm">
                                    <span id="lbl-id-2"></span>
                                    <span id="lbl-id-3"></span>
                                </div>

                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="cell-id-0">
                                    <input type="text" id="cell-id-1">
                                    <input type="text" id="cell-id-2">
                                    <input type="text" id="cell-id-3">
                                    <input type="text" id="cell-id-4">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="cell-id-5">
                                    <input type="text" id="cell-id-6">
                                    <input type="text" id="cell-id-7">
                                    <input type="text" id="cell-id-8">
                                    <input type="text" id="cell-id-9">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="cell-id-10">
                                    <input type="text" id="cell-id-11">
                                    <input type="text" id="cell-id-12">
                                    <input type="text" id="cell-id-13">
                                    <input type="text" id="cell-id-14">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="cell-id-15">
                                    <input type="text" id="cell-id-16">
                                    <input type="text" id="cell-id-17">
                                    <input type="text" id="cell-id-18">
                                    <input type="text" id="cell-id-19" onchange="alert('text')">
                                </div>
                            </div>
                            <div>
                                <br>
                            </div>
                            <div class="row">
                                <div class="col-sm">
                                    <input type="number" id="cell-id-term1">
                                </div>
                                <div class="col-sm">
                                    <input type="number" id="cell-id-term2">
                                </div>
                                <div class="col-sm">
                                    <input type="number" id="cell-id-t_res" onchange="alert('number')">
                                </div>
                            </div>
                        </div>                        
                    `
                }
            ]
        });
    }

    private testConnect()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt1 = new MessageWire(DataType.string, false, "input_channel1");
        
            let cu0 = HtmlBinCUBuilder.build(t0);        
            cu0.plugDual("value", cnt1.init);
        
            let cu1 = HtmlBinCUBuilder.build(t1);        
            cu1.plugDual("value", cnt1.term);
     
            console.log();
    
        }        
    }

    private testConnect2()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt1 = new MessageWire(DataType.number, false, "input_channel1");   
                
            let cu0 = HtmlBinCUBuilder.build(t_term1);
            cu0.plugDual("value", cnt1.init);

            let cu1 = HtmlBinCUBuilder.build(t_term2);
            cu1.plugDual("value", cnt1.term);

            console.log();    
        }        
    }

    private testBinCU1()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt1 = new MessageWire(DataType.string, false, "input_channel1");
            let cnt2 = new MessageWire(DataType.string, false, "input_channel2");
            let cnt3 = new MessageWire(DataType.string, false, "input_channel3");

            let cu0 = HtmlBinCUBuilder.build(t0);
            let cu1 = HtmlBinCUBuilder.build(t1);
            let cu5 = HtmlBinCUBuilder.build(t5);
            let cu6 = HtmlBinCUBuilder.build(t6);

            cu0.plugDual("value", cnt1.init);
            cu5.plugDual("value", cnt1.term);

            cu0.plugDual("value", cnt2.init);
            cu6.plugDual("value", cnt2.term);

            cu1.plugDual("value", cnt3.init);
            cu6.plugDual("value", cnt3.term);
        }
    }

    private testBus()
    {
        if(!Obj.isEmpty(t0))
        {
            let cu0 = HtmlBinCUBuilder.build(t0);
            let cu1 = HtmlBinCUBuilder.build(t1);
            let cu2 = HtmlBinCUBuilder.build(t2);
            let cu3 = HtmlBinCUBuilder.build(t3);
            let cu4 = HtmlBinCUBuilder.build(t4);

            let cnt0 = new MessageWire(DataType.string, true, "connect0");
            let cnt1 = new MessageWire(DataType.string, true, "connect1");
            let cnt2 = new MessageWire(DataType.string, false, "connect2");
            let cnt3 = new MessageWire(DataType.string, false, "connect3");
            let cnt4 = new MessageWire(DataType.string, false, "connect4");

            cu0.plugDual("value", cnt0.init);
            cu1.plugDual("value", cnt1.init);
            cu2.plugDual("value", cnt2.init);
            cu3.plugDual("value", cnt3.init);
            cu4.plugDual("value", cnt4.init);

            let bus = new MessageBus();

            bus.addPlug(cnt0.term);
            bus.addPlug(cnt1.term);
            bus.addPlug(cnt2.term);
            bus.addPlug(cnt3.term);
            bus.addPlug(cnt4.term);
        }
    }

    private testConnectJunction()
    {
        if(!Obj.isEmpty(t0))
        {   // not all directness combinations
            let df1 = false;
            let cnt0 = new MessageWire(DataType.string, df1, "connect0");
            let cnt1 = new MessageWire(DataType.string, df1, "connect1");
            let cnt2 = new MessageWire(DataType.string, df1, "connect2");
            let cnt3 = new MessageWire(DataType.string, df1, "connect3");
            let cnt4 = new MessageWire(DataType.string, df1, "connect4");

            let cuI0 = HtmlBinCUBuilder.build(t0);
            let cuI1 = HtmlBinCUBuilder.build(t1);
            let cuI2 = HtmlBinCUBuilder.build(t2);
            let cuI3 = HtmlBinCUBuilder.build(t3);
            let cuI4 = HtmlBinCUBuilder.build(t4);

            cuI0.plugDual("value", cnt0.init);
            cuI1.plugDual("value", cnt1.init);
            cuI2.plugDual("value", cnt2.init);
            cuI3.plugDual("value", cnt3.init);
            cuI4.plugDual("value", cnt4.init);

            let jnct = new MessageWireJunction(Flow.DUAL);

            jnct.setInitPlug(cnt0.term);
            jnct.setInitPlug(cnt1.term);
            jnct.setInitPlug(cnt2.term);
            jnct.setInitPlug(cnt3.term);
            jnct.setInitPlug(cnt4.term);

            let df2 = false;
            let cnt5 = new MessageWire(DataType.string, df2, "connect5");
            let cnt6 = new MessageWire(DataType.string, df2, "connect6");
            let cnt7 = new MessageWire(DataType.string, df2, "connect7");
            let cnt8 = new MessageWire(DataType.string, df2, "connect8");
            let cnt9 = new MessageWire(DataType.string, df2, "connect9");

            jnct.setTermPlug(cnt5.init);
            jnct.setTermPlug(cnt6.init);
            jnct.setTermPlug(cnt7.init);
            jnct.setTermPlug(cnt8.init);
            jnct.setTermPlug(cnt9.init);

            let cuT0 = HtmlBinCUBuilder.build(t5);
            let cuT1 = HtmlBinCUBuilder.build(t6);
            let cuT2 = HtmlBinCUBuilder.build(t7);
            let cuT3 = HtmlBinCUBuilder.build(t8);
            let cuT4 = HtmlBinCUBuilder.build(t9);

            cuT0.plugDual("value", cnt5.term);
            cuT1.plugDual("value", cnt6.term);
            cuT2.plugDual("value", cnt7.term);
            cuT3.plugDual("value", cnt8.term);
            cuT4.plugDual("value", cnt9.term);
        }
    }

    private testSumCU()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt_t1 = new MessageWire(DataType.number, true, "cnt_t1");
            let cnt_t2 = new MessageWire(DataType.number, true, "cnt_t2");
            let cnt_rs = new MessageWire(DataType.number, false, "cnt_rs");
    
            let cu_t1 = HtmlBinCUBuilder.build(t_term1);
            let cu_t2 = HtmlBinCUBuilder.build(t_term2);
            let cu_rs = HtmlBinCUBuilder.build(t_res);
    
            // let cu_t1 = HtmlBinCUBuilder.build(t0);
            // let cu_t2 = HtmlBinCUBuilder.build(t1);
            // let cu_rs = HtmlBinCUBuilder.build(t5);
    
            cu_t1.plugDual("value", cnt_t1.init);
            cu_t2.plugDual("value", cnt_t2.init);
    
            let sum = new SumCU();
            let suId = sum.id;
    
            sum.plugIn("term1", cnt_t1.term);
            sum.plugIn("term2", cnt_t2.term);
            sum.plugOut("sum", cnt_rs.init);
    
            cu_rs.plugDual("value", cnt_rs.term);
    
            //--------------------
            // let cnt5 = new NeuroConnect(DataType.number, false, "connect5");
            // cu_t1.plugDual("value", cnt5.init);
            // let cuT0 = HtmlBinCUBuilder.build(t5);
            // cuT0.plugDual("value", cnt5.term);
    
            // let cnt6 = new NeuroConnect(DataType.string, false, "connect6");
            // let cuT1 = HtmlBinCUBuilder.build(t6);
    
    
            // cuT0.plugDual("value", cnt5.term);
            // cuT1.plugDual("value", cnt6.term);
            }
    }

    private testAppSetServer()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt0 = new MessageWire(DataType.string, false, "connect0");
            let cnt1 = new MessageWire(DataType.string, false, "connect1");
            let cnt2 = new MessageWire(DataType.string, false, "connect2");
           
            let cuI0 = HtmlBinCUBuilder.build(t0);
            let cuI1 = HtmlBinCUBuilder.build(t1);
            let cuI2 = HtmlBinCUBuilder.build(t2);

            cuI0.plugDual("value", cnt0.init);
            cuI1.plugDual("value", cnt1.init);
            cuI2.plugDual("value", cnt2.init);

            let srv = new AppSetServer();

            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt0.term);
            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt1.term);
            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt2.term);

            let p0 = new Parcel("DEFAULT_LANG");
            p0.TriggerType = TriggerType.Request;

            let p1 = new Parcel("r1");
            p1.TriggerType = TriggerType.Request;

            let p2 = new Parcel("r2");
            p2.TriggerType = TriggerType.Request;
            
            cnt0.term.fire(p0);
            cnt1.term.fire(p1);
            cnt2.term.fire(p2);
        }
    }

    private testAppSetServer2()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt0 = new MessageWire(DataType.string, false, "connect0");
            let cnt1 = new MessageWire(DataType.string, false, "connect1");
            let cnt2 = new MessageWire(DataType.string, false, "connect2");
           
            let cuI0 = HtmlBinCUBuilder.build(t0);
            let cuI1 = HtmlBinCUBuilder.build(t1);
            let cuI2 = HtmlBinCUBuilder.build(t2);

            cuI0.plugDual("value", cnt0.init);
            cuI1.plugDual("value", cnt1.init);
            cuI2.plugDual("value", cnt2.init);

            let jnctB = new MessageWireJunction(Flow.DUAL);      

            jnctB.setInitPlug(cnt0.term);
            jnctB.setInitPlug(cnt1.term);
            jnctB.setInitPlug(cnt2.term);

            let cnt3 = new MessageWire(DataType.string, false, "connect3");

            jnctB.setTermPlug(cnt3.init);
                        
            let srv = new AppSetServer();

            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt3.term);

            let p0 = new Parcel("DEFAULT_LANG");
            p0.TriggerType = TriggerType.Request;

            let p1 = new Parcel("r1");
            p1.TriggerType = TriggerType.Request;

            let p2 = new Parcel("r2");
            p2.TriggerType = TriggerType.Request;
            
            cnt0.term.fire(p0);
            cnt1.term.fire(p1);
            cnt2.term.fire(p2);
        }
    }

    private testAppSetServer3()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt1 = new MessageWire(DataType.string, false, "connect1");
            let cnt2 = new MessageWire(DataType.string, false, "connect2");
            let cnt3 = new MessageWire(DataType.string, false, "connect3");
           
            let cuI1 = HtmlBinCUBuilder.build(t0);
            let cuI2 = HtmlBinCUBuilder.build(t1);
            let cuI3 = HtmlBinCUBuilder.build(t2);

            cuI1.plugDual("value", cnt1.init);
            cuI2.plugDual("value", cnt2.init);
            cuI3.plugDual("value", cnt3.init);

            let jnctB = new MessageWireJunction(Flow.DUAL);      

            jnctB.setInitPlug(cnt1.term);
            jnctB.setInitPlug(cnt2.term);
            jnctB.setInitPlug(cnt3.term);

            let cnt4 = new MessageWire(DataType.string, false, "connect4");
            let cnt5 = new MessageWire(DataType.string, false, "connect5");
            let cnt6 = new MessageWire(DataType.string, false, "connect6");

            jnctB.setTermPlug(cnt4.init);
            jnctB.setTermPlug(cnt5.init);
            jnctB.setTermPlug(cnt6.init);

            let jnct2 = new MessageWireJunction(Flow.DUAL);      

            jnct2.setInitPlug(cnt4.term);
            jnct2.setInitPlug(cnt5.term);
            jnct2.setInitPlug(cnt6.term);

            let cnt7 = new MessageWire(DataType.string, false, "connect7");

            jnct2.setTermPlug(cnt7.init);
                        
            let srv = new AppSetServer();

            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt7.term);

            let p1 = new Parcel("DEFAULT_LANG");
            p1.TriggerType = TriggerType.Request;

            let p2 = new Parcel("r1");
            p2.TriggerType = TriggerType.Request;

            let p3 = new Parcel("r2");
            p3.TriggerType = TriggerType.Request;
            
            cnt1.term.fire(p1);
            cnt2.term.fire(p2);
            cnt3.term.fire(p3);
        }
    }

    private testAppSetServer4()
    {
        if(!Obj.isEmpty(t0))
        {
            let cnt1 = new MessageWire(DataType.string, false, "connect1");
            let cnt2 = new MessageWire(DataType.string, false, "connect2");
            let cnt3 = new MessageWire(DataType.string, false, "connect3");
           
            let cuI1 = HtmlBinCUBuilder.build(t0);
            let cuI2 = HtmlBinCUBuilder.build(t1);
            let cuI3 = HtmlBinCUBuilder.build(t2);

            cuI1.plugDual("value", cnt1.init);
            cuI2.plugDual("value", cnt2.init);
            cuI3.plugDual("value", cnt3.init);

            let jnctB = new MessageWireJunction(Flow.DUAL);      

            jnctB.setInitPlug(cnt1.term);
            jnctB.setInitPlug(cnt2.term);
            jnctB.setInitPlug(cnt3.term);

            let cnt4 = new MessageWire(DataType.string, false, "connect4");
            let cnt5 = new MessageWire(DataType.string, false, "connect5");
            let cnt6 = new MessageWire(DataType.string, false, "connect6");

            jnctB.setTermPlug(cnt4.init);
            jnctB.setTermPlug(cnt5.init);
            jnctB.setTermPlug(cnt6.init);

            let jnct1 = new MessageWireJunction(Flow.DUAL);      

            jnct1.setInitPlug(cnt4.term);
            jnct1.setInitPlug(cnt5.term);
            jnct1.setInitPlug(cnt6.term);

            // -----------------------------------------

            let cnt14 = new MessageWire(DataType.string, false, "connect14");
            let cnt15 = new MessageWire(DataType.string, false, "connect15");
            let cnt16 = new MessageWire(DataType.string, false, "connect16");

            jnct1.setTermPlug(cnt14.init);
            jnct1.setTermPlug(cnt15.init);
            jnct1.setTermPlug(cnt16.init);

            let jnct2 = new MessageWireJunction(Flow.DUAL);      

            jnct2.setInitPlug(cnt14.term);
            jnct2.setInitPlug(cnt15.term);
            jnct2.setInitPlug(cnt16.term);

            let cnt7 = new MessageWire(DataType.string, false, "connect7");

            // -----------------------------------------

            jnct2.setTermPlug(cnt7.init);
                        
            let srv = new AppSetServer();

            srv.plugDual(AppSetServer.APP_SETTING_VALUE, cnt7.term);

            let p1 = new Parcel("DEFAULT_LANG");
            p1.TriggerType = TriggerType.Request;

            let p2 = new Parcel("r1");
            p2.TriggerType = TriggerType.Request;

            let p3 = new Parcel("r2");
            p3.TriggerType = TriggerType.Request;
            
            cnt1.term.fire(p1);
            cnt2.term.fire(p2);
            cnt3.term.fire(p3);
        }
    }
}