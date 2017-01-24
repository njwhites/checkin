import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StudentProvider} from '../../providers/student-provider';

@Component({
  selector: 'page-therapist-student-details',
  templateUrl: 'therapist-student-details.html'
})
export class TherapistStudentDetailsPage {
  selectedStudent: any;

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
  }


}
