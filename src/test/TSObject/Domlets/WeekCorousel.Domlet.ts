import { html } from "lit-html";
import { Domlet } from "../Domoliter/Domlet";
import { AppPartType } from "../Domoliter/AppPartType";
import { Domolit } from "../Domoliter/Domolit";
import { LabelTextSet } from "../Settings/LabelText";
import { LanguageOption } from "../Settings/LabelText";
import { DateData_LabelTextService } from "../Services/DateData_LabelText.Service";
import { Calendar } from "../Models/DateTime/Calendar";
import { DataType } from "../Lib/Util/DataType";
import { Obj } from "../Lib/TSExt/Obj";
import { HtmlTemplate } from "../Graphics/Rendering/Display.h";
import { Num } from "../Lib/TSExt/Num";
import { CU_Signature } from "../Alternative/CU_Signature";
import { Parcel } from "../Alternative/Parcel";
import { TriggerType } from "../Alternative/TriggerType";

export class WeekCorouselDomlet extends Domlet 
{
    public static readonly CURRENT_DATE = "WeekCorousel.CurrentDate";
    public static readonly LANGUAGE_CHOICE = "WeekCorousel.LanguageChoice";

    private currentDate = new Date();
    private languageChoice: LanguageOption;

    public cuSignature(): CU_Signature 
    {
        let cus: CU_Signature = {
            InputPorts: [
                { PortName: WeekCorouselDomlet.CURRENT_DATE, DataType: DataType.Date },
            ],
            DualPorts: [
                { PortName: WeekCorouselDomlet.LANGUAGE_CHOICE, DataType: LanguageOption }
            ]
        }

        return cus;
    }

    public template(): Domolit 
    {
        return this.domolit({
            type: AppPartType.domolit,
            children: [
                {
                    type: AppPartType.html_template,
                    inner_html: html`
                        
                        <div class="week-calendar full-wide align-items-center justify-content-center">
                            <table class="full-wide">
                                <tr>
                                    <td></td>

                                    ${this.weekEmpty()}
                                    
                                    <td></td>
                                </tr>
                                <tr class="large-screen-content">
                                    <td></td>

                                    ${this.weekDayLargeInit()}

                                    <td></td>
                                </tr>
                                <tr>
                                    <td class="date-nav-left">
                                        <i class="fas fa-solid fa-chevron-left fa-2xl nav-large large-screen-element" @click=${() => {this.moveWeek(false);}}></i>
                                        <i class="fas fa-solid fa-chevron-left fa-lg nav-small small-screen-element" @click=${() => {this.moveWeek(false);}}></i>                                        
                                    </td>

                                    ${this.weekDayDateInit()}

                                    <td class="date-nav-right">
                                        <i class="fas fa-solid fa-chevron-right fa-2xl nav-large large-screen-element" @click=${() => {this.moveWeek(true);}}></i>
                                        <i class="fas fa-solid fa-chevron-right fa-lg nav-small small-screen-element" @click=${() => {this.moveWeek(true);}}></i>
                                    </td>
                                </tr>
                            </table>
                    </div>
                    `
                }
            ]
        });
    }

    private getWeekDayDateSpan(weekDay: number):HTMLSpanElement{
        let elementId = this.rootId() + '-month-day-' + weekDay;
        return (<HTMLSpanElement> this.htmlElement().querySelector("#" + elementId));
    }

    private getWeekDayLargeSpan(weekDay: number):HTMLSpanElement{
        let elementId = this.rootId() + '-week-large-' + weekDay;
        return <HTMLSpanElement> this.htmlElement().querySelector("#" + elementId);
    }

    private getWeekDaySmallSpan(weekDay: number):HTMLSpanElement{
        let elementId = this.rootId() + '-week-small-' + weekDay;
        return <HTMLSpanElement> this.htmlElement().querySelector("#" + elementId);
    }

    private weekEmpty(){
        return [0, 1, 2, 3, 4, 5, 6].map(d => html`
            <td></td>
            <td></td>
        `);
    }

    private weekDayLargeInit(): HtmlTemplate
    {
       // inside of the span: ${this.weekDayLabel(weekDay)}
       return [0, 1, 2, 3, 4, 5, 6].map(weekDay => html`
            <td></td>
            <td>
                <span class="week-day-name" id="${this.rootId() + '-week-large-' + weekDay}">
                    
                </span>
            </td>
        `);
    }
    
    private weekDayDateInit(): HtmlTemplate
    {
        // inside of the span: ${this.weekDayLabel(weekDay)}
        // inside of the span: ${Calendar.getWeekDayForDate(!Obj.isEmpty(this.currentDate) ? this.currentDate : new Date(), weekDay).getDate()}
        return [0, 1, 2, 3, 4, 5, 6].map(weekDay => html`
            <td class="week-day-small">            
                <span id="${this.rootId() + '-week-small-' + weekDay}"  class="vertical-text small-screen-element">
                    
                </span>
            </td>
            <td class="date-day">
                <span id="${this.rootId() + '-month-day-' + weekDay}">
                    
                </span>
            </td>
        `);
    }

    public weekDayLabelDataPrefix(): string {
        return "Date.Week.Weekday.name.";
    }

    public monthNameLabelDataPrefix():string{
        return "Date.Month.name.";
    }

    public dateDataService():any{
        return DateData_LabelTextService;
    }

    public weekDayLabel(keyId: string|number){
        var labelTextSet = this.labelSet(this.dateDataService(), this.weekDayLabelDataPrefix() + keyId);
        return this.label(labelTextSet);
    }

    public monthNameLabel(keyId: string|number){
        var labelTextSet = this.labelSet(this.dateDataService(), this.monthNameLabelDataPrefix() + keyId);
        return this.label(labelTextSet);
    }

    private label(labelTextSet: LabelTextSet): string
    {
        switch(this.languageChoice)
        {
            case LanguageOption.English: return labelTextSet.English;
            case LanguageOption.Russian: return labelTextSet.Russian;
            default: return labelTextSet.English;
            // default: return labelTextSet.Russian;
        }
    }


    private showWeekDays()
    {
        for(let d = 0; d < 7; d++)
        {
            var wd = "" + Calendar.getWeekDayForDate(this.currentDate, d).getDate();
            this.getWeekDayDateSpan(d).innerHTML = wd;
        }
    }

    private showWeekLabels()
    {        
        for(let d = 0; d < 7; d++)
        {
            let wl = this.getWeekDayLargeSpan(d);
            if(!Obj.isEmpty(wl)){
                wl.innerHTML = this.weekDayLabel(d);
            }

            let ws = this.getWeekDaySmallSpan(d);
            if(!Obj.isEmpty(ws)){
                ws.innerHTML = this.weekDayLabel(d);
            }
        }
    }

    public process(): void 
    {
        this.languageChoice = <LanguageOption> this.dualGet(WeekCorouselDomlet.LANGUAGE_CHOICE)?.Value;
               
        this.showWeekLabels();
        this.showWeekDays();
    }   

    public afterLoading(): void 
    {
        let rqstPrsl = new Parcel();
        rqstPrsl.TriggerType = TriggerType.Request;
        this.fireDualExternally(WeekCorouselDomlet.LANGUAGE_CHOICE, rqstPrsl);
    }

    private moveWeek(forward: boolean)
    {
        this.currentDate.setDate( this.currentDate.getDate() + 7 * (forward ? 1 : -1) );
        this.showWeekDays();
    }
    

    // private weekSplit(): [number, Date]
    // {
    //     if(Obj.isEmpty(this.weekStartDate)){
    //         return null;
    //     }

    //     let days = Calendar.getDaysInMonth(this.weekStartDate.getMonth(), this.weekStartDate.getFullYear());
    //     let split = days - this.weekStartDate.getDate();

    //     if(split < 7){
    //         let newDate = new Date();
    //         newDate.setDate(days);
    //         return [split, newDate];
    //     }
    //     else{
    //         return [split, null];
    //     }
    // }
}