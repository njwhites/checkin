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

  constructor(public navCtrl: NavController, public navParams: NavParams, public classRoomService: ClassRoomProvider, public studentService: StudentProvider, public userService: UserProvider) {
    this.classRoomService.getAllClassRooms().then((data) =>{
      this.classrooms = <Array<ClassRoomModel>>data;
    });
  }

  ionViewDidLoad() {}

  toggleDropDown(id) {
    let dividerId = "classroom_" + id;
    if (document.getElementById(dividerId).style.display === "none"){
      document.getElementById(dividerId).style.display = "block";
    } else {
      document.getElementById(dividerId).style.display = "none";
    }
  }

  getDropDownStatus(id) {
    let dividerId = "classroom_" + id;
    if (document.getElementById(dividerId) === null){
      return false;
    }
    else if (document.getElementById(dividerId).style.display === "none"){
      return true;
    } else {
      return false;
    }
  }

}
