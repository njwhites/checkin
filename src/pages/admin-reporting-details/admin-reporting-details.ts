import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
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
  }

  ionViewDidLoad() {
  }

}
