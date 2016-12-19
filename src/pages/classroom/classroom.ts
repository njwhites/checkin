import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TeacherListPage } from '../teacher-list/teacher-list';
import { StudentCheckinPage } from '../student-checkin/student-checkin';

/*
  Generated class for the Classroom page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html'
})
export class ClassroomPage {
    
    tab1 = TeacherListPage;
    tab2 = StudentCheckinPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
