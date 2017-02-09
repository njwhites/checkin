import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider'
import {BillingProvider} from '../../providers/billing-provider'


@Component({
  selector: 'page-admin-reporting',
  templateUrl: 'admin-reporting.html'
})
export class AdminReportingPage {
  rooms = [{number: 0, on: false},
           {number: 1, on: false},
           {number: 2, on: false},
           {number: 3, on: false}];
  students = [{name: "John Deere", hours:17},
              {name: "Jane Doe", hours:20},
              {name: "Fred Jones", hours:25}];

  constructor(public navCtrl: NavController,
              public checkinService: CheckinProvider,
              public billingService: BillingProvider){
  }

  ionViewDidLoad() {
    console.log('Hello AdminReportingPage Page');
  }

  exportData(){
    console.log("gonna export here");
    var date = new Date();
    while(date.getDay() !== 1){
      date.setDate(date.getDate()-1);
    }
    console.log(date);
    this.billingService.writeBillingWeek(date,"102");
  }

  toggleRoom(number:number){
    console.log("click");
    this.rooms[number].on = !this.rooms[number].on;
  }
}
