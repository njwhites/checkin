import { Component } from '@angular/core';
import { Control } from '@angular2/common';
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
  }

  directPage(numid){
    var id = Number(numid.value);
    if(id >= 1000 && id <= 1999){
      this.navCtrl.push(this.teacherListPage);
    } else if(id >= 2000 && id <= 2999) {
      this.navCtrl.push(this.studentCheckinPage);
    } else {
      console.log("invalid");
    }
    numid.value = '';
  }
}
