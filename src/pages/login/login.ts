import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeacherListPage } from '../teacher-list/teacher-list';
import { StudentCheckinPage } from '../student-checkin/student-checkin';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  teacherListPage = TeacherListPage;
  studentCheckinPage = StudentCheckinPage;
  directToPage;

  constructor(public navCtrl: NavController) {}
  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  directPage(id){
    if(id == 1){
      this.navCtrl.push(this.teacherListPage);
    }
  }
}
