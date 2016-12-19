import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import { ClassroomPage } from '../classroom/classroom';
import { StudentCheckinPage } from '../student-checkin/student-checkin';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  classroomPage = ClassroomPage;
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
      if(this._isTeacherLogin(id)){
        this.navCtrl.push(this.classroomPage);
      }else{
        //not a teacher
        this._toastFailedLogin(id);
      }
    }else{
      //is valid
      if(this._isValidLogin(id)){
        this.navCtrl.push(this.studentCheckinPage, {room: this.room});
      }else{
        this._toastFailedLogin(id);
      }
    }
    //reset textbox value
    numid.value = '';
  }

  _toastFailedLogin(id){
    console.log(`invalid login for room: ${this.room} with ID: ${id}`);
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
