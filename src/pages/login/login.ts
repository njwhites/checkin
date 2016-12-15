import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TeacherListPage } from '../teacher-list/teacher-list';
import { StudentCheckinPage } from '../student-checkin/student-checkin';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  teacherListPage = TeacherListPage;
  studentCheckinPage = StudentCheckinPage;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {}

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

  help(){
    let toast = this.toastCtrl.create({
      message: 'Help is on the way',
      duration: 1500,
      position: 'bottom'
    });

    toast.present(toast);
  }
}
