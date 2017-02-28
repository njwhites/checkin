import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
    //set the initial visible Time in and out as well
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
    //the validators make sure that each field is not empty and each field is a positive number
    // additionally time in are enforced to be time in before time out in time order

    //test object is an object to hold the key:string and formcontrol combinations
    //this object is used to create the form group
    let testObject = {};

    //form group needs to be initialzed for some of the self referencing validators
    //we initialize the form group to have a bunch of empty form controls
    //for each day we do TimeIn, TimeOut, NapHours, OT, PT, and SP
    this.days.forEach((day, index)=>{
      testObject[day+'TimeIn'] = new FormControl();
      testObject[day+'TimeOut'] = new FormControl();
      testObject[day+'NapHours'] = new FormControl();
      testObject[day+'OT'] = new FormControl();
      testObject[day+'PT'] = new FormControl();
      testObject[day+'SP'] = new FormControl();
    });
    //here we create the new Form Group from the initialzed object of formControls
    this.studentDataForm = new FormGroup(testObject);

    //now we update the form group to have the correct form controls
    this.days.forEach((day, index)=>{

      //time in and time out are similar in that they perform the same funcionality back and forth
      //the first paramater is the key the second is the formControl to use
      //the first paramater of the form creation is the value to initialze the form to
      //it is either null if the start_time is "-1" or the visible time version
      this.studentDataForm.setControl(day+'TimeIn', new FormControl(
        (this.student.student_days[index].start_time >= 0) ? this.visibleTimeIn[index] : null,

        //to use multiple validators we have to compose them
        //we are going to throw warnings when a field is empty and when time in isn't before time out
         Validators.compose([Validators.required, (control:FormControl)=>{
           // if either time in or time out are null then don't say anything about time in being after time out
           if(control.value === null || this.studentDataForm.controls[day+'TimeOut'].value === null){
             return null;
           }

           //make the readable times numbers to be compared
           let splitIn = control.value.split(':');
           let splitOut = this.studentDataForm.controls[day+'TimeOut'].value.split(':');

           let hhIn = splitIn[0];
           let mmIn = splitIn[1];

           let hhOut = splitOut[0];
           let mmOut = splitOut[1];

           let timeIn = Number(hhIn * 60 + mmIn);
           let timeOut = Number(hhOut * 60 + mmOut);

           //if timein is not before timeout we will warn the user
           return (timeIn >= timeOut) ? {startAfterEnd: true} : null;
         }])
      ));
      this.studentDataForm.setControl(day+'TimeOut', new FormControl(
        (this.student.student_days[index].end_time >= 0) ? this.visibleTimeOut[index] : null,
         Validators.compose([Validators.required, (control:FormControl)=>{
           if(control.value === null || this.studentDataForm.controls[day+'TimeIn'].value === null){
             return null;
           }
           let splitOut = control.value.split(':');
           let splitIn = this.studentDataForm.controls[day+'TimeIn'].value.split(':');

           let hhIn = splitIn[0];
           let mmIn = splitIn[1];

           let hhOut = splitOut[0];
           let mmOut = splitOut[1];

           let timeIn = Number(hhIn * 60 + mmIn);
           let timeOut = Number(hhOut * 60 + mmOut);
           console.log("\tIN:\t"+splitIn);
           console.log(timeIn);
           console.log("\tOut:\t"+splitOut);
           console.log(timeOut);

           return (timeIn >= timeOut) ? {startAfterEnd: true} : null;
         }])
      ));
      //nap and therapy times are enforced to be positive numbers
      // so if they aren't tell the user
      this.studentDataForm.setControl(day+'NapHours', new FormControl(
        this.student.student_days[index].nap_hours,
         Validators.compose([Validators.required,  (control: FormControl)=>{
           if(!isNaN(Number(control.value))){
             return (control.value < 0 ) ? {notPositiveNumber:true}: null;
           } else {
             return {notPositiveNumber:true}
           }
         }])
     ));
     this.studentDataForm.setControl(day+'SP', new FormControl(
       this.student.student_days[index].SP_therapy_hours,
        Validators.compose([Validators.required,  (control: FormControl)=>{
          if(!isNaN(Number(control.value))){
            return (control.value < 0 ) ? {notPositiveNumber:true}: null;
          } else {
            return {notPositiveNumber:true}
          }
        }])
      ));
      this.studentDataForm.setControl(day+'PT', new FormControl(
        this.student.student_days[index].PT_therapy_hours,
         Validators.compose([Validators.required,  (control: FormControl)=>{
           if(!isNaN(Number(control.value))){
             return (control.value < 0 ) ? {notPositiveNumber:true}: null;
           } else {
             return {notPositiveNumber:true}
           }
         }])
      ));
      this.studentDataForm.setControl(day+'OT', new FormControl(
        this.student.student_days[index].OT_therapy_hours,
         Validators.compose([Validators.required,  (control: FormControl)=>{
           if(!isNaN(Number(control.value))){
             return (control.value < 0 ) ? {notPositiveNumber:true}: null;
           } else {
             return {notPositiveNumber:true}
           }
         }])
      ));
    });

    //now for each day we want to make sure that the time in and out are checking eachother
    this.days.forEach((day, index)=>{
      //time in is similar to timeout so reference this for both
      //when the time in value changes we will tell it to check the validity of time out
      this.studentDataForm.controls[day+'TimeIn'].valueChanges.subscribe((value)=>{
        //in order to avoid an infinite loop we will check the that the new value is actually different than the old value
        if(value !== this.visibleTimeIn[index]){
          //since the value is different we will update the old value
          this.visibleTimeIn[index] = value;
          this.studentDataForm.controls[day+'TimeOut'].updateValueAndValidity();
        }
      });
      this.studentDataForm.controls[day+'TimeOut'].valueChanges.subscribe((value)=>{
        if(value !== this.visibleTimeOut[index]){
          this.visibleTimeOut[index] = value;
          this.studentDataForm.controls[day+'TimeIn'].updateValueAndValidity();
        }
      });
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


    let isInOutNull = false;

    //switch on the field so that we only compute the field we need
    //all cases are set the student field equal to the changed value, casting as a number incase we need that to do .toFixed or anything similar
    switch(field){
      case("0"):
      //if the change is to clear out the input value then lets make the start time -1 like checkin provider does
      //The main purpose of this is if an admin accidentally adds a checkin time to a day the student was absent
      // then they would be stuck with that time value even if the input field is cleared
        if(event.target.value === ''){
        } else{
          this.student.student_days[day].start_time = this.toEpochMS(event.target.value, new Date(this.student.student_days[day].start_time));
        }
        break;
      case("1"):
      //see case "0" for an explanation
        if(event.target.value === ''){
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
    //double check that the output isn't negative
    if(this.student.student_days[day].end_time >= this.student.student_days[day].start_time){
      this.student.student_days[day].gross_hours = (this.student.student_days[day].end_time - this.student.student_days[day].start_time) / 3600000;
    } else {
      this.student.student_days[day].gross_hours = 0;
    }


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
    if(time === null){
      return date.getTime();
    }
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
