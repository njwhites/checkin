import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider';
import {ClassRoomProvider} from '../../providers/class-room-provider';
import {StudentProvider} from '../../providers/student-provider';
import {ConstantsProvider} from '../../providers/constants-provider';
import {AdminReportingDetailsPage} from '../admin-reporting-details/admin-reporting-details';

import {ClassroomWeek, BillingWeekModel, BillingDay, StudentBillingWeek} from '../../models/db-models';

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

  //what we pass to the checkin service
  weekStart: Date;

  //what we have the user interact with
  viewableDate: any;

  //variable to hold the rate, since this variable will likely only be chnaged by one person it is not going to be "live updated"
  rate : number;

  displayInfo: boolean = false;

  daysInSession: number = 5;
  interval: any;

  isLoading: boolean = false;

  loadingTextStart: string = "Your data is loading";
  loadingText: string;
  countDots: number = 0;
  loadingTextInterval: any;

  constructor(public navCtrl: NavController,
              public studentService: StudentProvider,
              public classroomService: ClassRoomProvider,
              public constantsService: ConstantsProvider,
              public checkinService: CheckinProvider){
    constantsService.returnRate().then((doc:any)=>{
      this.rate = doc.rate;
    }).catch((err)=>{
      console.log(err);
    });
    var date = new Date();
    if(date.getDay() < 1){
      date.setDate(date.getDate()+1);
    }
    while(date.getDay() !== 1){
      date.setDate(date.getDate()-1);
    }

    //this was from some previous testing where weekStart was going to be bound to the date picker, now we just set it to the monday of this week
    this.weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.map = new Map<Number, ClassroomWeek>();

    //in order to let the user interact with the date picker and see their selection I am using two variables
    //this.weekStart is the actual date object that we pass to our internal mehtods
    //this.viewableDate is bound to the date picker so that the user can see the date they are on
    //because months are indexed from 0 we have to do some silliness to get the correct format for our visible date
    let month = date.getMonth();
    //increment the month number since january.getMonth() gives 0 and so on when we want to start at 1
    month++;
    //set a string version that will be used becuase the viewable date wants MM and a number less than ten will only be one digit, not two
    //and then if the month is less than 10 give it a leading zero
    // this could probably also be done with .toPrecision(2)? if we want to change it 2/22/2017
    let stringMonth = (month).toString();
    if(month <10){
      stringMonth = '0'+month;
    }
    //finally put the information we have in the form yyyy-mm-dd
    this.viewableDate = date.getFullYear() +"-"+stringMonth+"-"+date.getDate();
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


        clearInterval(this.interval);
        this.interval = undefined;

        //set the studentBillingDayTotals to the values for each student_id
        //for each room in the map
        this.studentBillingDayTotals = new Map<String, BillingDay>();
        this.roomBillingWeekTotals = new Map<String, BillingDay>();

        this.map.forEach((room)=>{
          //for each student in the room
          var tempArray = [];
          if(room.weeks.length < 1){
            console.log("was about to fill the totals but this rooms weeks array is empty");
          } else {
            room.weeks[0].students.forEach((student)=>{
              //clear out any of the old -1's for billable_hours
              student.student_days.forEach((day:BillingDay, index) => {
                day.billable_hours = Math.max(0,day.billable_hours);
              });
              var temp = student.student_days.reduce(this.reducer);
              this.studentBillingDayTotals.set(student.student_id, temp);
              tempArray.push(temp);
            })
            this.roomBillingWeekTotals.set(room.room_number, tempArray.reduce(this.reducer));


            //Turning off the loading text
            this.isLoading = false;
            clearInterval(this.loadingTextInterval);
            this.loadingTextInterval = undefined;
            this.countDots = 0;
          }
        });

    //this.toCSV();
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
          console.log(this.classroomService.data.get(room.number + ""));
          if(cw === undefined || !this.classroomService.data.get(room.number + "").isBilled){
            console.log("cw was undefined for room: " + room.number + "    date: " + date);
            console.log("setting this room to a blank classrom week ");
            cw = new ClassroomWeek();
          }
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

  ionViewDidEnter() {
    //when we reenter the page from the reporting details page we should be recalculating the totals incase someone changed something while they were in details
    // if need be we can gain a lot of performance increase by only updating the room and student that the user had clicked on and is now navigating back from
    // we can also check if the data has been changed to skip over it in the event that the data hasn't been changed

    //reset rate when we enter this screen just incase it was changed
    this.constantsService.returnRate().then((doc:any)=>{
      this.rate = doc.rate;
    }).catch((err)=>{
      console.log(err);
    });

    if(this.displayInfo){
      this.map.forEach((room)=>{
        //for each student in the room
        var tempArray = [];
        if(room.weeks.length < 1){
          console.log("was about to fill the totals but this rooms weeks array is empty");
        } else {
          room.weeks[0].students.forEach((student)=>{
            var temp = student.student_days.reduce(this.reducer);
            this.studentBillingDayTotals.set(student.student_id, temp);
            tempArray.push(temp);
          })
          this.roomBillingWeekTotals.set(room.room_number, tempArray.reduce(this.reducer));
        }
      });
    }
  }


  exportData(){
    console.log(this.toCSV());
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

  //this may not work as intended?
  writeBillingWeeks(){
    return new Promise(resolve=>{
      var completeCount = 0;

      this.rooms.forEach(room => {
        this.checkinService.writeBillingWeek(this.weekStart, room.number + "").then(() => {
          completeCount++;
        });
      });
      var done : NodeJS.Timer;

      var timeout = setTimeout(() => {
        clearInterval(done);
        clearTimeout(timeout);
        //like prompt or something that it failed ??
        resolve(false);
      }, 8000);

      //check every 1/4 second if all are done
      var done = setInterval(() => {
        if( completeCount === this.rooms.length)
        {
          clearInterval(done);
          clearTimeout(timeout);
          resolve();
        }
      }, 100);
    })
  }

  fillWeek(){
    this.map = new Map<Number, ClassroomWeek>();

    this.isLoading = true;
    this.loadingText = this.loadingTextStart;
    this.loadingTextInterval = setInterval(() => {
      this.loadingText = this.loadingTextStart;

      this.countDots = (this.countDots + 1) % 4
      for(var i = 0; i < this.countDots; i++){
        this.loadingText += ".";
      }
    }, 500);

    this.writeBillingWeeks().then(()=>{
      console.log("write billing then");
      this.setup(new Date(this.weekStart));
    })
    this.displayInfo = !this.displayInfo;
  }

  dateInputChanged(){
    //split the viewable date into its components, new Date() seems to work better if we pass it in a series of values for year, month, date, so on
    // rather than passing it a date string
    let splitArray = this.viewableDate.split('-');
    //because month indexing is zero based and not january = 1 etc we need to remove one  from the viewable version of month
    this.weekStart = new Date(new Date(splitArray[0],(splitArray[1] - 1),splitArray[2]));

    //if the day is a sunday, then we want to go forward to the monday
    if(this.weekStart.getDay() < 1){
      this.weekStart.setDate(this.weekStart.getDate()+1);
    }

    //if the day is not sunday and not monday we want to go back to the monday at the start of the week
    while(this.weekStart.getDay() !== 1){
      this.weekStart.setDate(this.weekStart.getDate()-1);
    }

    //toggle the display so that the user has to regenerate the data
    if(this.displayInfo){
      this.displayInfo = !this.displayInfo;
    }
  }

  toCSV(){
    var out = "data:text/csv;charset=utf-8,";
    out += "Date,Servicetype,BeginTime,EndTime,Hours,staff_1,clients_1\n"
    var date : Date;
    this.map.forEach((value:ClassroomWeek, key) =>{
      var week = value.weeks[0];
      date = new Date(week.start_date);
      week.students.forEach((student:StudentBillingWeek) => {
        student.student_days.forEach((day:BillingDay, index) => {
          if(day.billable_hours !== 0) {
            var today = new Date(week.start_date);
            today.setDate(today.getDate() + index);
            var str = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
            out += `${str},`;
            out += "PS,";
            out += ",";
            out += ",";
            out += day.billable_hours + ",";
            out += "'000001,"
            out += "NAMEJOE\n";
          }
        });
      });
    });

    //These are the lines that create the download and download it in the browser
    var encodedUri = encodeURI(out);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    //-----------------------------------

    return out;
  }
}
