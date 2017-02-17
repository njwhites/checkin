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
  data = [7.50, 15.00, 7.50, 1.00, 0.50, 0.00, 0.00, 6.00, 5.00, 16.46, 82.30, 0.00,
          7.50, 15.00, 7.50, 0.50, 0.00, 0.50, 0.00, 6.50, 5.00, 16.46, 82.30, 0.00,
          7.50, 15.00, 7.50, 1.00, 0.50, 0.00, 0.00, 6.00, 5.00, 16.46, 82.30, 0.00,
          7.50, 13.00, 5.50, 0.75, 0.00, 0.00, 0.00, 4.75, 4.00, 16.46, 65.84, 0.00,
          7.50, 15.00, 7.50, 1.00, 0.50, 0.50, 0.00, 5.50, 5.00, 16.46, 82.30, 0.00
        ];

  reducer: any;
  totals: BillingDay;

  studentDataForm: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public checkinService: CheckinProvider,
              public studentService: StudentProvider) {
    this.student = navParams.get("student");
    this.student.student_days.forEach(day => {
      day.OT_therapy_hours = Math.max(day.OT_therapy_hours, 0);
      day.PT_therapy_hours = Math.max(day.PT_therapy_hours, 0);
      day.SP_therapy_hours = Math.max(day.SP_therapy_hours, 0);
      day.billable_hours = Math.max(day.billable_hours, 0);
      day.gross_hours = Math.max(day.gross_hours, 0);
      day.nap_hours = Math.max(day.nap_hours, 0);
      day.net_hours = Math.max(day.net_hours, 0);
    })
    this.reducer = navParams.get("reducer");
    this.totals = this.student.student_days.reduce(this.reducer);
    console.log(this.student);

    //construct the form for all of the days data here
    this.studentDataForm = this.formBuilder.group({
      MTimeIn: [,Validators.required],
      MTimeOut: [, Validators.required],
      MNapHours: [, Validators.required],
      MSP: [, Validators.required],
      MPT: [, Validators.required],
      MOT: [, Validators.required],
      TTimeIn: [,Validators.required],
      TTimeOut: [, Validators.required],
      TNapHours: [, Validators.required],
      TSP: [, Validators.required],
      TPT: [, Validators.required],
      TOT: [, Validators.required],
      WTimeIn: [,Validators.required],
      WTimeOut: [, Validators.required],
      WNapHours: [, Validators.required],
      WSP: [, Validators.required],
      WPT: [, Validators.required],
      WOT: [, Validators.required],
      THTimeIn: [,Validators.required],
      THTimeOut: [, Validators.required],
      THNapHours: [, Validators.required],
      THSP: [, Validators.required],
      THPT: [, Validators.required],
      THOT: [, Validators.required],
      FTimeIn: [,Validators.required],
      FTimeOut: [, Validators.required],
      FNapHours: [, Validators.required],
      FSP: [, Validators.required],
      FPT: [, Validators.required],
      FOT: [, Validators.required]
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
        //TODO extra logic to transform user input into a number the data model likes, similar for end_time
        this.student.student_days[day].start_time = <number>(event.target.value);
        break;
      case("1"):
        this.student.student_days[day].end_time = <number>(event.target.value);
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
    //this.student.student_days[day].gross_hours = this.student.student_days[day].end_time - this.student.student_days[day].start_time;

    this.student.student_days[day].net_hours = this.student.student_days[day].gross_hours
                                               - this.student.student_days[day].nap_hours
                                               - this.student.student_days[day].SP_therapy_hours
                                               - this.student.student_days[day].PT_therapy_hours
                                               - this.student.student_days[day].OT_therapy_hours;

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


    if( (this.student.student_days[day].SP_therapy_hours
        + this.student.student_days[day].PT_therapy_hours
        + this.student.student_days[day].OT_therapy_hours) > 1){
      this.student.student_days[day].therapyWarning = true;
    } else {
      this.student.student_days[day].therapyWarning = false;
    }

    //recompute the totals since things have changed
    this.totals = this.student.student_days.reduce(this.reducer);

  }

}
