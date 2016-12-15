import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StudentDetailsPage } from '../student-details/student-details';

@Component({
  selector: 'page-teacher-list',
  templateUrl: 'teacher-list.html'
})
export class TeacherListPage {
  selectedStudent: any;
  students: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedStudent = navParams.get('student');

    this.students = [];
    this.students.push({
      title: 'Matthew',
      note: 'checked in at 8:15am',
      icon: 'man'
    });
    this.students.push({
      title: 'Mark',
      note: 'checked in at 8:05am',
      icon: 'man'
    });
    this.students.push({
      title: 'Sarah',
      note: 'checked in at 8:05am',
      icon: 'woman'
    });
    this.students.push({
      title: 'Laurel',
      note: 'checked in at 7:55am',
      icon: 'woman'
    });
    this.students.push({
      title: 'Luke',
      note: 'checked in at 8:10am',
      icon: 'man'
    });
    this.students.push({
      title: 'Katie',
      note: 'checked in at 8:00am',
      icon: 'woman'
    });
  }

  studentTapped(event, student) {
    this.navCtrl.push(StudentDetailsPage, {
      student: student
    });
  }
}
