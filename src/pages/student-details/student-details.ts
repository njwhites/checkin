import {Component, Input} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CheckinProvider} from '../../providers/checkin-provider';

@Component({
  selector: 'page-student-details',
  templateUrl: 'student-details.html'
})
export class StudentDetailsPage {
  @Input() selectedStudent: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public checkinService: CheckinProvider) {
    // If we navigated to this page, we will have a student available as a nav param
    this.selectedStudent = navParams.get('student');
  }
}
