import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider';
import {ClassRoomProvider} from '../../providers/class-room-provider';
import {StudentProvider} from '../../providers/student-provider';
import {AdminReportingDetailsPage} from '../admin-reporting-details/admin-reporting-details';

import {ClassroomWeek, BillingWeekModel, BillingDay} from '../../models/db-models';

@Component({
  selector: 'page-admin-reporting',
  templateUrl: 'admin-reporting.html'
})
export class AdminReportingPage {
  rooms = [{number: 101, on: false},
           {number: 102, on: false},
           {number: 103, on: false},
           {number: 104, on: false}];
  students = [{name: "John Deere", hours:17},
              {name: "Jane Deere", hours:20},
              {name: "Fred Jones", hours:25},
              {name: "James Dean", hours:25},
              {name: "Will Smith", hours:18}];
  map: Map<Number, ClassroomWeek>;

  interval: any;

  constructor(public navCtrl: NavController, public studentService: StudentProvider, public classroomService: ClassRoomProvider, public checkinService: CheckinProvider){
    var date = new Date();
    while(date.getDay() !== 1){
      date.setDate(date.getDate()-1);
    }
    this.setup(date)
    
  }

  setup(date: Date){

    //if this gets called and the interval is still waiting, reset it to the new one
    if(this.interval){
      clearInterval(this.interval);
      this.interval = undefined;
    }
   

    this.setMap(date);

    //Checking every 1/4 second to see if all results are back
    this.interval = setInterval(()=> {
      if(this.map.size === this.rooms.length){
        //all the maps have come back
        //reassigning so the ngfor refreshes
        this.map = new Map(this.map);

        console.log(this.map);
        clearInterval(this.interval);
        this.interval = undefined;
        console.log(this.map.get(101).weeks[0].students[0]);
        var test = this.map.get(101).weeks[0].students[0].student_days.reduce(this.reducer);
        console.log(test);
      }
    }, 250);
  }

  reducer(prev, curr){
      if(curr.gross_hours < 0){
        return prev;
      }
      var ret = new BillingDay();
      ret.OT_therapy_hours = prev.OT_therapy_hours + curr.OT_therapy_hours;
      ret.PT_therapy_hours = prev.PT_therapy_hours + curr.PT_therapy_hours;
      ret.SP_therapy_hours = prev.SP_therapy_hours + curr.SP_therapy_hours;
      ret.billable_hours = prev.billable_hours + curr.billable_hours;
      ret.gross_hours = prev.gross_hours + curr.gross_hours;
      ret.net_hours = prev.net_hours + curr.net_hours;
      ret.nap_hours = prev.nap_hours + curr.nap_hours;
      return ret;
  }

  setMap(date: Date){
    this.map = new Map<Number, ClassroomWeek>();
    this.rooms.forEach(room => {
      this.getClassroomBilling(room.number + "", date).then((cw : ClassroomWeek) => {    
        this.map.set(room.number, cw);
        console.log(this.map.size + " " + this.map.keys.length);
      })
    })

  }

  getClassroomBilling(room_number: String, start_date: Date){
    return new Promise((resolve, reject) => {
      this.checkinService.getClassroomBilling(room_number + "", ((cw: ClassroomWeek) => {
        cw.weeks = cw.weeks.filter((week: BillingWeekModel) => {
          var sd = new Date(week.start_date);
          return start_date.getDate() === sd.getDate() &&
            start_date.getMonth() === sd.getMonth() &&
            start_date.getFullYear() === sd.getFullYear();
        })
        resolve(cw);
      }));
    })
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
    this.rooms.forEach(room => {
      this.checkinService.writeBillingWeek(date, room.number + "");
    })
  }

  toggleRoom(number:number){
    //WORKS
    var thisRoom = this.rooms.filter(room => {
      return room.number = number;
    })[0];

    thisRoom.on = !thisRoom.on;

  }

  showDetails(student_id){
    this.navCtrl.push(AdminReportingDetailsPage, {s_id : student_id}, {});
  }
}
