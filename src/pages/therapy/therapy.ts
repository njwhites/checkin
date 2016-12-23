import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';

@Component({
  selector: 'page-therapy',
  templateUrl: 'therapy.html'
})
export class TherapyPage {
  userID: number;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {}

  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      this.userID = idCheck;
      var login = document.getElementById('enterIDTherapy');
      login.style.display = 'none';
      var list = document.getElementById('studentListTherapy');
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
    let toast = this.toastCtrl.create({
      message: studentName + ' is off to therapy',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

}
