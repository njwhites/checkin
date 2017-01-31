import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {UserProvider} from '../../providers/user-provider';
import {TherapistAddPage} from '../therapist-add/therapist-add';
import {TherapistStudentDetailsPage} from '../therapist-student-details/therapist-student-details'

@Component({
  selector: 'page-therapist',
  templateUrl: 'therapist.html'
})
export class TherapistPage {
  id: number;
  therapistStudents: Array<string>;
  studentList: any;

  constructor(public studentService: StudentProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public userService: UserProvider) {
    this.studentList = this.studentService.data;
    this.id = navParams.data;
    this.userService.getTherapistFavoriteIDs(this.id.toString()).then((result:any) => {
      this.therapistStudents = result;
    }).catch((err) => {
      console.log(err);
    });
  }

  add() {
    this.navCtrl.push(TherapistAddPage, {
      favStudents: this.therapistStudents,
      therapistID: this.id
    });
  }

  studentTapped(student) {
    this.navCtrl.push(TherapistStudentDetailsPage, {
      student: student,
      status: this.studentList.get(student).location,
      id: this.id
    });
  }

  isEmpty() {
    let isEmpty: boolean;
    isEmpty = true;
    if(this.therapistStudents){
      if(this.therapistStudents.length !== 0){
        console.log(this.therapistStudents.length);
        isEmpty = false;
      }
      console.log(this.therapistStudents.length);
    }
    return isEmpty;
  }

  getTherapistName(_id: String) {
    return this.userService.data.get(String(_id)).fName + " " + this.userService.data.get(String(_id)).lName;
  }

  ionViewDidEnter() {
    this.studentService.getStudents().then(()=> {
      this.studentList = this.studentService.data;
    }).catch((err) => {
      console.log(err);
    });
    this.userService.getTherapistFavoriteIDs(this.id.toString()).then((result:any) => {
      this.therapistStudents = result;
    }).catch((err) => {
      console.log(err);
    });
  }

  //remove a student from therapist faorite ids
  //takes as input the student id for the student to be removed from the list
  removeStudent(SID: String){
    //ask the user provider to remove the student from the favorited list
    this.therapistStudents.splice(this.therapistStudents.indexOf(SID.toString()), 1);

    this.userService.removeTherapistFavoriteID(String(this.id), SID).then((success) => {
      if(success){
        //now that the student is removed, update the list
        this.userService.getTherapistFavoriteIDs(this.id.toString()).then((result:any) => {
          this.therapistStudents = result;
        }).catch((err) => {
          console.log(err);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }

}
