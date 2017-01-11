import {Component} from '@angular/core';
import {NavController, ToastController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-nurse',
  templateUrl: 'nurse.html'
})
export class NursePage {
  userID: number;
  roomNumber: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.roomNumber = this.navParams.data;
  }

  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      this.userID = idCheck;
      var login = document.getElementById('enterIDNurse');
      login.style.display = 'none';
      var list = document.getElementById('studentListNurse');
      list.style.display = 'block';
    } else {
      let toast = this.toastCtrl.create({
        message: 'Incorrect ID',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

  revert(studentName:string):void {
    var list = document.getElementById('studentListNurse');
    list.style.display = 'none';
    var login = document.getElementById('enterIDNurse');
    login.style.display = 'block';
    if(studentName !== 'back') {
      let toast = this.toastCtrl.create({
        message: studentName + ' is off to the nurse',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

}
