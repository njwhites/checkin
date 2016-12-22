import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {PresentStudentsPage} from "../present-students/present-students";
import {NapPage} from "../nap/nap";
import {TherapyPage} from "../therapy/therapy";
import {NursePage} from "../nurse/nurse";

@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {

  tab1 = PresentStudentsPage;
  tab2 = NapPage;
  tab3 = TherapyPage;
  tab4 = NursePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
