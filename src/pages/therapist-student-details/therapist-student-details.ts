import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from "../../providers/checkin-provider";
import {UserProvider} from "../../providers/user-provider";

@Component({
  selector: 'page-therapist-student-details',
  templateUrl: 'therapist-student-details.html'
})
export class TherapistStudentDetailsPage {
  selectedStudent: string;
  id: number;

  constructor(public userService: UserProvider, public studentService: StudentProvider, public checkinService: CheckinProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
    this.id = navParams.get('id');

  }

  checkoutStudent() {
    this.userService.getTherapistTypeByID(this.id.toString()).then((type:string) => {
      this.checkinService.therapistCheckout(this.selectedStudent, this.id.toString(), type);
    });
    this.navCtrl.pop();
  }


}
