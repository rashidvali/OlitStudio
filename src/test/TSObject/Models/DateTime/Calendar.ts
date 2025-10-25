import { Obj } from "../../Lib/TSExt/Obj";

export class Calendar
{
    public static getWeekDayForDate(date: Date, dayOffset = 0): Date
    {
        if(Obj.isEmpty(date)){
            return null;
        }

        if(dayOffset > 6){
            dayOffset = 6;
        }

        let mn = new Date(date);
        mn.setDate(mn.getDate() - date.getDay() + dayOffset);

        return mn;
    }

    public static getDaysInMonth(zeroBasedMonthNo: number, year: number): number{
        return (new Date(year, zeroBasedMonthNo, 0)).getDate();
    }
}