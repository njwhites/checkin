import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-admin-reporting-details',
  templateUrl: 'admin-reporting-details.html'
})
export class AdminReportingDetailsPage {
  student:any;
  days = ["M","T","W","TH","F"];
  titles = ["Time In", "Time Out", "Gross Hours", "Nap", "SP", "Pt", "OT", "Net Hours", "Billed Hours",
            "Rate", "Total Billed", "Avg Hours/ Day"]
  data = [7.50, 15.00, 7.50, 1.00, 0.50, 0.00, 0.00, 6.00, 5.00, 16.46, 82.30, 0.00,
          7.50, 15.00, 7.50, 0.50, 0.00, 0.50, 0.00, 6.50, 5.00, 16.46, 82.30, 0.00,
          7.50, 15.00, 7.50, 1.00, 0.50, 0.00, 0.00, 6.00, 5.00, 16.46, 82.30, 0.00,
          7.50, 13.00, 5.50, 0.75, 0.00, 0.00, 0.00, 4.75, 4.00, 16.46, 65.84, 0.00,
          7.50, 15.00, 7.50, 1.00, 0.50, 0.50, 0.00, 5.50, 5.00, 16.46, 82.30, 0.00
        ];
  totals = [35.50, 4.25, 1.50, 1.00, 0.00, 28.75, 24.00, 16.46, 395.04, 4.80];

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.student = navParams.get("student");
    console.log(this.student);
  }

  ionViewDidLoad() {
  }

}
