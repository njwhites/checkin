import {Component, Input} from "@angular/core";
import {NavController} from 'ionic-angular';
import {StudentDetailsPage} from '../student-details/student-details'
import {CheckinProvider} from '../../providers/checkin-provider';


@Component({
  selector: 'page-student-info-button',
  templateUrl: 'student-info-button.html'
})
export class StudentInfoButtonPage {
  @Input() thisStudent: any;
  @Input() thisStudentLocation: any;

  constructor(public navCtrl: NavController, public checkinService: CheckinProvider) {}

  displayInfo() {
    this.navCtrl.push(StudentDetailsPage, {
      student: this.thisStudent
    });
  }

}
