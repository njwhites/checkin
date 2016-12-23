import {Component, Input} from "@angular/core";
import {NavController} from 'ionic-angular';
import {StudentDetailsPage} from '../student-details/student-details'

@Component({
  selector: 'page-student-info-button',
  templateUrl: 'student-info-button.html'
})
export class StudentInfoButtonPage {
  @Input() thisStudent: any;

  constructor(public navCtrl: NavController) {}

  displayInfo() {
    this.navCtrl.push(StudentDetailsPage, {
      student: this.thisStudent
    });
  }

}
