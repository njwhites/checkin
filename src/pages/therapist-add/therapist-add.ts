import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
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
  classrooms: Array<ClassRoomModel>;
  favStudents: Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public classRoomService: ClassRoomProvider, public studentService: StudentProvider, public userService: UserProvider, public toastCtrl: ToastController) {
    this.classRoomService.getAllClassRooms().then((data) =>{
      this.classrooms = <Array<ClassRoomModel>>data;
    });
    this.favStudents = navParams.get('favStudents');
  }

  ionViewDidLoad() {
    console.log(this.favStudents);
  }

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
    let toast = this.toastCtrl.create({
      message: this.studentService.data.get(sID).fName.toString() + " " + this.studentService.data.get(sID).lName.toString() + " added to favorites",
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }
}
