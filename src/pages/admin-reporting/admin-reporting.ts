import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider';
import {BillingProvider} from '../../providers/billing-provider';
import {AdminReportingDetailsPage} from '../admin-reporting-details/admin-reporting-details';

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
              {name: "Jane Deere", hours:20},
              {name: "Fred Jones", hours:25},
              {name: "James Dean", hours:25},
              {name: "Will Smith", hours:18}];

  constructor(public navCtrl: NavController
              ){
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
    //this.checkinService.writeBillingWeek(date,"102");
  }

  toggleRoom(number:number){
    this.rooms[number].on = !this.rooms[number].on;
  }

  showDetails(SID){
    this.navCtrl.push(AdminReportingDetailsPage, {SID:SID}, {});
  }
}
