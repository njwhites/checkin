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
  studentBillingDayTotals : Map<String, BillingDay>;
  map: Map<Number, ClassroomWeek>;
  roomBillingWeekTotals: Map<String,any>;

  weekStart: Date;

  daysInSession: number = 5;
  interval: any;

  constructor(public navCtrl: NavController, public studentService: StudentProvider, public classroomService: ClassRoomProvider, public checkinService: CheckinProvider){
    var date = new Date();
    while(date.getDay() !== 1){
      date.setDate(date.getDate()-1);
    }

    this.setup(date);
    this.weekStart = date;
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

        //set the studentBillingDayTotals to the values for each student_id
        //for each room in the map
        this.studentBillingDayTotals = new Map<String, BillingDay>();
        this.roomBillingWeekTotals = new Map<String, BillingDay>();

        this.map.forEach((room)=>{
          //for each student in the room
          var tempArray = [];
          room.weeks[0].students.forEach((student)=>{
            var temp = student.student_days.reduce(this.reducer);
            this.studentBillingDayTotals.set(student.student_id, temp);
            tempArray.push(temp);
          })
          this.roomBillingWeekTotals.set(room.room_number, tempArray.reduce(this.reducer));
        });
        console.log(this.roomBillingWeekTotals);
        console.log(this.studentBillingDayTotals);
      }
    }, 250);
  }

  reducer(prev:BillingDay, curr:BillingDay){
      var ret = new BillingDay();
      ret.OT_therapy_hours = Math.max(0, prev.OT_therapy_hours) + Math.max(0, curr.OT_therapy_hours);
      ret.PT_therapy_hours = Math.max(0, prev.PT_therapy_hours) + Math.max(0, curr.PT_therapy_hours);
      ret.SP_therapy_hours = Math.max(0, prev.SP_therapy_hours) + Math.max(0, curr.SP_therapy_hours);
      ret.billable_hours = Math.max(0, prev.billable_hours) + Math.max(0, curr.billable_hours);
      ret.gross_hours = Math.max(0, prev.gross_hours) + Math.max(0, curr.gross_hours);
      ret.net_hours = Math.max(0, prev.net_hours) + Math.max(0, curr.net_hours);
      ret.nap_hours = Math.max(0, prev.nap_hours) + Math.max(0, curr.nap_hours);
      ret.attendanceWarning = prev.attendanceWarning || curr.attendanceWarning;
      ret.billingWarning = prev.billingWarning || curr.billingWarning;
      ret.therapyWarning = prev.therapyWarning || curr.therapyWarning;
      return ret;
  }

  setMap(date: Date){
    this.map = new Map<Number, ClassroomWeek>();
    this.rooms.forEach(room => {
      this.getClassroomBilling(room.number + "", date).then((cw : ClassroomWeek) => {
        this.map.set(room.number, cw);
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
      return room.number === number;
    })[0];

    thisRoom.on = !thisRoom.on;

  }

  isRoomOn(number: number){
    //console.log(this.rooms);
    return this.rooms.filter(room => {
      return room.number === number;
    })[0].on;
  }

  showDetails(student){
    this.navCtrl.push(AdminReportingDetailsPage, {student : student, reducer: this.reducer}, {});
  }

}
