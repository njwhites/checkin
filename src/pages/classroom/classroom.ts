import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {PresentStudentsPage} from "../present-students/present-students";
import {TherapyPage} from "../therapy/therapy";
import {GenericPage} from "../generic/generic";
import {SignoutPage} from "../signout/signout"
import {SigninPage} from "../signin/signin"

@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {
  roomNumber: string;
  students: string[];

  tab0 = SigninPage;
  tab1 = PresentStudentsPage;
  tab3 = TherapyPage;
  tab4 = GenericPage;
  tab5 = SignoutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomNumber = this.navParams.get('roomNumber');
    this.students = this.navParams.get('students');
  }

  ionViewDidLoad() {
    //console.log("roomNumber: " + this.roomNumber);
    //console.log("students: " + this.students);
  }

}
