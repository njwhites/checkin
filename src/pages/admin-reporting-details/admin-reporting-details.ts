import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';

import { CheckinProvider } from '../../providers/checkin-provider'
import { StudentProvider } from '../../providers/student-provider'

import {ClassroomWeek, StudentBillingWeek, BillingDay} from '../../models/db-models';


@Component({
  selector: 'page-admin-reporting-details',
  templateUrl: 'admin-reporting-details.html'
})
export class AdminReportingDetailsPage {
  student:StudentBillingWeek;
  days = ["M","T","W","TH","F"];
  titles = ["Time In", "Time Out", "Gross Hours", "Nap", "SP", "Pt", "OT", "Net Hours", "Billed Hours",
            "Rate", "Total Billed", "Avg Hours/ Day"]

  reducer: any;
  totals: BillingDay;

  studentDataForm: any;

  visibleTimeIn: Array<string>;
  visibleTimeOut: Array<string>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public checkinService: CheckinProvider,
              public studentService: StudentProvider) {
    //the student of interest is passed in here, these are pass by reference so this student is the same memory location as the room.week.student that was clicked from the previous page
    this.student = navParams.get("student");

    //initialize the visible time in and time out arrays
    this.visibleTimeIn = new Array<string>();
    this.visibleTimeOut = new Array<string>();

    //make sure that any negatives we use to indicate not touched are not displayed as -1, rather zero
    this.student.student_days.forEach((day, index) => {
      this.visibleTimeIn.push(this.toReadableTime(day.start_time));
      this.visibleTimeOut.push(this.toReadableTime(day.end_time));
      day.OT_therapy_hours = Math.max(day.OT_therapy_hours, 0);
      day.PT_therapy_hours = Math.max(day.PT_therapy_hours, 0);
      day.SP_therapy_hours = Math.max(day.SP_therapy_hours, 0);
      day.billable_hours = Math.max(day.billable_hours, 0);
      day.gross_hours = Math.max(day.gross_hours, 0);
      day.nap_hours = Math.max(day.nap_hours, 0);
      day.net_hours = Math.max(day.net_hours, 0);
    })
    //get the reducer function for summing
    this.reducer = navParams.get("reducer");
    //calculate the sum from the week, this should be the same info as the previous page and the student list item that was clicked
    //but we recalculate to be sure
    this.totals = this.student.student_days.reduce(this.reducer);

    //construct the form for all of the days data here
    //time in and out are no longer editable but for now are left in the form incase we need to use them later 2/22/2017
    //the validators make sure that each field is not empty and each field is a positive number
    this.studentDataForm = this.formBuilder.group({
      MTimeIn: [(this.student.student_days[0].start_time >= 0) ? this.visibleTimeIn[0] : null,
                 Validators.compose([Validators.required, (control:FormControl)=>{
                   if(this.student.student_days[0].start_time > this.student.student_days[0].end_time){
                     return {startAfterEnd: true};
                   } else {
                     return null;
                   }
                 }])],
      MTimeOut: [(this.student.student_days[0].end_time >= 0) ? this.visibleTimeOut[0] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[0].start_time > this.student.student_days[0].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      MNapHours: [this.student.student_days[0].nap_hours,
                   Validators.compose([Validators.required,  (control: FormControl)=>{
                     if(!isNaN(Number(control.value))){
                       return (control.value < 0 ) ? {notPositiveNumber:true}: null;
                     } else {
                       return {notPositiveNumber:true}
                     }
                   } ])],
      MSP: [this.student.student_days[0].SP_therapy_hours,
            Validators.compose([Validators.required,  (control: FormControl)=>{
              if(!isNaN(Number(control.value))){
                return (control.value < 0 ) ? {notPositiveNumber:true}: null;
              } else {
                return {notPositiveNumber:true}
              }
            } ])],
      MPT: [this.student.student_days[0].PT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      MOT: [this.student.student_days[0].OT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      TTimeIn: [(this.student.student_days[1].start_time >= 0) ? this.visibleTimeIn[1] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[1].start_time > this.student.student_days[1].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      TTimeOut: [(this.student.student_days[1].end_time >= 0) ? this.visibleTimeOut[1] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[1].start_time > this.student.student_days[1].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      TNapHours: [this.student.student_days[1].nap_hours,
                   Validators.compose([Validators.required,  (control: FormControl)=>{
                     if(!isNaN(Number(control.value))){
                       return (control.value < 0 ) ? {notPositiveNumber:true}: null;
                     } else {
                       return {notPositiveNumber:true}
                     }
                   } ])],
      TSP: [this.student.student_days[1].SP_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      TPT: [this.student.student_days[1].PT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      TOT: [this.student.student_days[1].OT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      WTimeIn: [(this.student.student_days[2].start_time >= 0) ? this.visibleTimeIn[2] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[2].start_time > this.student.student_days[2].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      WTimeOut: [(this.student.student_days[2].end_time >= 0) ? this.visibleTimeOut[2] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[2].start_time > this.student.student_days[2].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      WNapHours: [this.student.student_days[2].nap_hours,
                   Validators.compose([Validators.required,  (control: FormControl)=>{
                     if(!isNaN(Number(control.value))){
                       return (control.value < 0 ) ? {notPositiveNumber:true}: null;
                     } else {
                       return {notPositiveNumber:true}
                     }
                   } ])],
      WSP: [this.student.student_days[2].SP_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      WPT: [this.student.student_days[2].PT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      WOT: [this.student.student_days[2].OT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      THTimeIn: [(this.student.student_days[3].start_time >= 0) ? this.visibleTimeIn[3] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[3].start_time > this.student.student_days[3].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      THTimeOut: [(this.student.student_days[3].end_time >= 0) ? this.visibleTimeOut[3] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[3].start_time > this.student.student_days[3].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      THNapHours: [this.student.student_days[3].nap_hours,
                   Validators.compose([Validators.required,  (control: FormControl)=>{
                     if(!isNaN(Number(control.value))){
                       return (control.value < 0 ) ? {notPositiveNumber:true}: null;
                     } else {
                       return {notPositiveNumber:true}
                     }
                   } ])],
      THSP: [this.student.student_days[3].SP_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      THPT: [this.student.student_days[3].PT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      THOT: [this.student.student_days[3].OT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      FTimeIn: [(this.student.student_days[4].start_time >= 0) ? this.visibleTimeIn[4] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[4].start_time > this.student.student_days[4].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      FTimeOut: [(this.student.student_days[4].end_time >= 0) ? this.visibleTimeOut[4] : null ,
           Validators.compose([Validators.required, (control:FormControl)=>{
             if(this.student.student_days[4].start_time > this.student.student_days[4].end_time){
               return {startAfterEnd: true};
             } else {
               return null;
             }
           }])],
      FNapHours: [this.student.student_days[4].nap_hours,
                   Validators.compose([Validators.required,  (control: FormControl)=>{
                     if(!isNaN(Number(control.value))){
                       return (control.value < 0 ) ? {notPositiveNumber:true}: null;
                     } else {
                       return {notPositiveNumber:true}
                     }
                   } ])],
      FSP: [this.student.student_days[4].SP_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      FPT: [this.student.student_days[4].PT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])],
      FOT: [this.student.student_days[4].OT_therapy_hours,
             Validators.compose([Validators.required,  (control: FormControl)=>{
               if(!isNaN(Number(control.value))){
                 return (control.value < 0 ) ? {notPositiveNumber:true}: null;
               } else {
                 return {notPositiveNumber:true}
               }
             } ])]
    });


  }

  ionViewDidLoad() {
  }

//method to be called whenever the student data form is changed
  formChanged(event){
    //temporary variable to store the two inputs from the split id
    let temp = event.target.id.split(',');

    //first number in id = the day that was modified
    let day = temp[0];
    //second number in id = the field that was modified
    let field = temp[1];

    //switch on the field so that we only compute the field we need
    //all cases are set the student field equal to the changed value, casting as a number incase we need that to do .toFixed or anything similar
    switch(field){
      case("0"):
      //if the change is to clear out the input value then lets make the start time -1 like checkin provider does
      //The main purpose of this is if an admin accidentally adds a checkin time to a day the student was absent
      // then they would be stuck with that time value even if the input field is cleared
        if(event.target.value === ''){
          this.student.student_days[day].start_time = -1;
        } else{
          this.student.student_days[day].start_time = this.toEpochMS(event.target.value, new Date(this.student.student_days[day].start_time));
        }
        break;
      case("1"):
      //see case "0" for an explanation
        if(event.target.value === ''){
          this.student.student_days[day].end_time = -1;
        } else{
          this.student.student_days[day].end_time = this.toEpochMS(event.target.value, new Date(this.student.student_days[day].end_time));
        }
        break;
      case("2"):
        this.student.student_days[day].nap_hours = <number>(event.target.value);
        break;
      case("3"):
        this.student.student_days[day].SP_therapy_hours = <number>(event.target.value);
        break;
      case("4"):
        this.student.student_days[day].PT_therapy_hours = <number>(event.target.value);
        break;
      case("5"):
        this.student.student_days[day].OT_therapy_hours = <number>(event.target.value);
        break;
      default:
        break;
    }

    //recompte the derived fields since one of the fields they were derived from possibly changed

    //gross hours and the way end and begin time are stored has some design decisions to be made
    this.student.student_days[day].gross_hours = (this.student.student_days[day].end_time - this.student.student_days[day].start_time) / 3600000;

    this.student.student_days[day].net_hours = this.student.student_days[day].gross_hours
                                               - this.student.student_days[day].nap_hours
                                               - this.student.student_days[day].SP_therapy_hours
                                               - this.student.student_days[day].PT_therapy_hours
                                               - this.student.student_days[day].OT_therapy_hours;

    //billable hours is a maximum of 5 or the hour rounded down i.e. 6.3 -> 5, 3.7-> 3
    this.student.student_days[day].billable_hours = Math.min(5, Math.trunc(this.student.student_days[day].net_hours));

    //reevaluate the conditions for warnings
    if(this.student.student_days[day].gross_hours < 7){
      this.student.student_days[day].attendanceWarning = true;
    } else {
      this.student.student_days[day].attendanceWarning = false;
    }

    if(this.student.student_days[day].billable_hours < 5){
      this.student.student_days[day].billingWarning = true;
    } else {
      this.student.student_days[day].billingWarning = false;
    }

    //due to some strangeness with typing this.student...SP_therapy_hours was acting like a string
    //the cleanest solution I had was to create a new Number object. It is unclear why the number primitive wasn't working but this does 2/22/2017
    let total: number = 0;
    total += Number(this.student.student_days[day].SP_therapy_hours);
    total += Number(this.student.student_days[day].PT_therapy_hours);
    total += Number(this.student.student_days[day].OT_therapy_hours);
    if( (total) > 1){
      this.student.student_days[day].therapyWarning = true;
    } else {
      this.student.student_days[day].therapyWarning = false;
    }

    //recompute the totals since things have changed
    this.totals = this.student.student_days.reduce(this.reducer);

  }

  //I use this so that we can have one popup that tells the user the form has errors
  //formgroups can check if any one form control has an error but that requires a popup for each form control
  //I want it to check the whole formgroup, the input 'error' is a string that the form is checking to see, for example 'required'
  formHasError(error: string){
    let hasError = false;
    //Object.keys gets each formcontrol as an array and then we foreach that so that we can check each control in a loop
    Object.keys(this.studentDataForm.controls).forEach((key, index)=>{
      if(this.studentDataForm.controls[key].hasError(error)){
        hasError = true;
      }
    })
    return hasError;
  }

  //takes in the readable time and that days date and returns the milliseconds for the supplied date at that hour and minute
  toEpochMS(time: string, date: Date): number{
    let splitTime = time.split(':');
    let hh = splitTime[0];
    let mm = splitTime[1];
    let modifiedDate = new Date(date);
    //if the hours or minutes are null we will just not make any change
    if(hh === '' || mm === ''){
      return date.getTime();
    }

    modifiedDate.setHours(Number(hh));
    modifiedDate.setMinutes(Number(mm));
    return modifiedDate.getTime();
  }

  //takes the milliseconds from epoch time as a number and turns it to the format of hh:ss as a string
  toReadableTime(ms: number):string{
    if(ms < 0){
      return '';
    } else {
      let dateTime = new Date(ms);
      let hours: string | number = dateTime.getHours();
      let min: string | number = dateTime.getMinutes();
      if(hours < 10){
        hours = '0'+hours;
      }
      if(min < 10){
        min = '0'+min;
      }
      return hours + ":" + min;
    }
  }
}
