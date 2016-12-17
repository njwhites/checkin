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
    // checks that classroom login is valid
    if(this.room.toLowerCase() === 'classroom'){
      //check for validity of the teacher
      if(id >= 1000 && id <= 1999){
        this.navCtrl.push(this.teacherListPage);
      }else{
        //not a teacher
        console.log(`invalid login for room: ${this.room}`);
      }
    }else{
      //is valid
      if(this._isValidLogin(id)){
        this.navCtrl.push(this.studentCheckinPage, {room: this.room});
      }else{
        console.log('invalid login');
      }
    }
    numid.value = '';
  }

  _isTeacherLogin(num){
    return num >= 1000 && num <= 1999
  }

  _isValidLogin(num){
    return num > 0 && num < 5000;
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
