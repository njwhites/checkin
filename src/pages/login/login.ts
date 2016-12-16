import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import { TeacherListPage } from '../teacher-list/teacher-list';
import { StudentCheckinPage } from '../student-checkin/student-checkin';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  teacherListPage = TeacherListPage;
  studentCheckinPage = StudentCheckinPage;
  room: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.room = navParams.get('room');
  }

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
