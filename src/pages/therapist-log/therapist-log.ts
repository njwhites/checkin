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
  studentTransactions: Array<any> = new Array<any>();
  fav_ids: any;
  studentList: any;
  location: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public studentService: StudentProvider,
              public userService: UserProvider) {
    this.id = navParams.data;
    this.checkinService.getTherapyHistory(this.id.toString()).then((result: Array<TransactionTherapy>) => {
        console.log(result)
        this.transactions = result;
    });
  }

  ionViewDidLoad() {
  }

  getTherapistName(_id: String) {
    return this.userService.data.get(String(_id)).fName + " " + this.userService.data.get(String(_id)).lName;
  }

  getUserName(id: string, studentId: string){
    let me = this.userService.data.get(id);
    let student = this.studentService.data.get(studentId);
    return me.therapy_type + " with " + student.fName + " " + student.lName;
  }

}
