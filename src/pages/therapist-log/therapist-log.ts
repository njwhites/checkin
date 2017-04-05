import { Component } from '@angular/core';
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from "../../providers/checkin-provider";
import {UserProvider} from "../../providers/user-provider";
import { NavController, NavParams } from 'ionic-angular';
import {TransactionTherapy} from "../../models/db-models"
import {StudentModel} from "../../models/db-models"



@Component({
  selector: 'page-therapist-log',
  templateUrl: 'therapist-log.html'
})
export class TherapistLogPage {
  id: Number;
  transactions: Array<any> = new Array<any>();
  fav_ids: any;
  studentList: any;
  location: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public studentService: StudentProvider,
              public userService: UserProvider) {
    this.id = navParams.data;
    this.fav_ids = this.userService.data.get(String(this.id)).therapy_fav_ids;
    this.studentService.getStudents().then(()=> {
      this.studentList = this.studentService.data;
    }).catch((err) => {
      console.log(err);
    });
    console.log(this.studentList)
    for(let student in this.studentList){
      console.log("Student: " + student)
    }
  }

  ionViewDidLoad() {
  }

  getTherapistName(_id: String) {
    return this.userService.data.get(String(_id)).fName + " " + this.userService.data.get(String(_id)).lName;
  }

}
