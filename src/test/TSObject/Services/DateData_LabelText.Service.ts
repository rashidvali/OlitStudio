import { LabelTextService } from "./LabelText.Service";

export class DateData_LabelTextService extends LabelTextService
{
    public static readonly prefix: string = "Date.Week.Weekday.name";

    private static _labels = this.loadLabels();

    public static labels(): any{
        return this._labels;
    }

    public static loadLabels():any
    {
        return {
            "Date.Week.Weekday.name.0": {
                "English": "Sunday",
                "Russian": "Воскресенье"
            },
            "Date.Week.Weekday.name.1": {
                "English": "Monday",
                "Russian": "Понедельник"
            },
            "Date.Week.Weekday.name.2": {
                "English": "Tuesday",
                "Russian": "Вторник"
            },
            "Date.Week.Weekday.name.3": {
                "English": "Wednesday",
                "Russian": "Среда"
            },
            "Date.Week.Weekday.name.4": {
                "English": "Thursday",
                "Russian": "Четверг"
            },
            "Date.Week.Weekday.name.5": {
                "English": "Friday",
                "Russian": "Пятница"
            },
            "Date.Week.Weekday.name.6": {
                "English": "Saturday",
                "Russian": "Суббота"
            }
            ,
            "Date.today": {
                "English": "Today",
                "Russian": "Сегодня"
            }
            ,
            "Date.Month.name.0": {
                "English": "January",
                "Russian": "Январь"
            },
            "Date.Month.name.1": {
                "English": "February",
                "Russian": "Февраль"
            },
            "Date.Month.name.2": {
                "English": "March",
                "Russian": "Март"
            },
            "Date.Month.name.3": {
                "English": "April",
                "Russian": "Апрель"
            },
            "Date.Month.name.4": {
                "English": "May",
                "Russian": "Май"
            },
            "Date.Month.name.5": {
                "English": "June",
                "Russian": "Июнь"
            },
            "Date.Month.name.6": {
                "English": "July",
                "Russian": "Июль"
            },
            "Date.Month.name.7": {
                "English": "August",
                "Russian": "Август"
            },
            "Date.Month.name.8": {
                "English": "September",
                "Russian": "Сентябрь"
            },
            "Date.Month.name.9": {
                "English": "October",
                "Russian": "Октябрь"
            },
            "Date.Month.name.10": {
                "English": "November",
                "Russian": "Ноябрь"
            },
            "Date.Month.name.11": {
                "English": "December",
                "Russian": "Декабрь"
            }

        };
    }
}