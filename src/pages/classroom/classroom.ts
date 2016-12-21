import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {PresentStudentsPage} from "../present-students/present-students";
// import {ListPage} from "../list/list";
import {NapPage} from "../nap/nap";

@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {

  tab1 = PresentStudentsPage;
  tab2 = NapPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
