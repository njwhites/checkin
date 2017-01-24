import {Component, Input} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {UserProvider} from '../../providers/user-provider';
import {TherapistAddPage} from '../therapist-add/therapist-add';
import {TherapistStudentDetailsPage} from '../therapist-student-details/therapist-student-details'

@Component({
  selector: 'page-therapist-favorite',
  templateUrl: 'therapist-favorite.html'
})
export class TherapistFavoritePage {
  therapistStudents: Array<string>
  @Input() id: number;

  constructor(public studentService: StudentProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public userService: UserProvider) {
    this.id = navParams.data;
    this.userService.getTherapistFavoriteIDs(this.id.toString()).then((result:any) => {
      this.therapistStudents = result;
    }).catch((err) => {
      console.log(err);
    });
  }

  add() {
    this.navCtrl.push(TherapistAddPage);
  }

  studentTapped(student) {
    this.navCtrl.push(TherapistStudentDetailsPage, {
      student: student,
      id: this.id
    })
  }

  getTherapistName(_id: String) {
    return this.userService.data.get(String(_id)).fName + " " + this.userService.data.get(String(_id)).lName;
  }

}
