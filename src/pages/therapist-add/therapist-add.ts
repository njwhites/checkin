import {Component} from "@angular/core";
import {NavController, ToastController, NavParams} from "ionic-angular";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";
import {ClassRoomModel} from "../../models/db-models";

/*
  Generated class for the TherapistAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-therapist-add',
  templateUrl: 'therapist-add.html'
})
export class TherapistAddPage {
  favStudents: Array<string>;
  tID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public classRoomService: ClassRoomProvider, public studentService: StudentProvider, public userService: UserProvider, public toastCtrl: ToastController) {
    this.favStudents = navParams.get('favStudents');
    this.tID = navParams.get('therapistID');
  }

  ionViewDidLoad() {}

  toggleDropDown(id) {
    let dividerId = "classroom_" + id;
    let buttonUpId = "upButton_" + id;
    let buttonDownId = "downButton_" + id;
    if (!document.getElementById(dividerId).hidden){
      document.getElementById(dividerId).hidden = true;
      document.getElementById(buttonUpId).hidden = true;
      document.getElementById(buttonDownId).hidden = false;
    } else {
      document.getElementById(dividerId).hidden = false;
      document.getElementById(buttonUpId).hidden = false;
      document.getElementById(buttonDownId).hidden = true;
    }
  }

  addToFavorites(sID) {
    this.userService.addTherapistFavoriteID(String(this.tID), String(sID));
    this.favStudents.push(sID);
    document.getElementById("student_" + sID).hidden = true;
    let toast = this.toastCtrl.create({
      message: this.studentService.data.get(sID).fName.toString() + " " + this.studentService.data.get(sID).lName.toString() + " added to favorites",
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  isEmpty(classroom) {
    for (let sID of classroom.students) {
      if (this.favStudents.indexOf(sID) == -1){
        return false;
      }
    }
    return true;
  }
}
