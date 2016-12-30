import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {PresentStudentsPage} from "../present-students/present-students";
import {NapPage} from "../nap/nap";
import {TherapyPage} from "../therapy/therapy";
import {NursePage} from "../nurse/nurse";
import {SignoutPage} from "../signout/signout"
import {SigninPage} from "../signin/signin"

@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {
  roomNumber: string;

  tab0 = SigninPage;
  tab1 = PresentStudentsPage;
  tab2 = NapPage;
  tab3 = TherapyPage;
  tab4 = NursePage;
  tab5 = SignoutPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomNumber = this.navParams.get('roomNumber');
  }

  ionViewDidLoad() {
    console.log(this.roomNumber);
  }

}
