import {Component} from '@angular/core';
import {NavController, ToastController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-therapy',
  templateUrl: 'therapy.html'
})
export class TherapyPage {
  userID: number;
  roomNumber: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.roomNumber = this.navParams.data;
  }

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
    var list = document.getElementById('studentListTherapy');
    list.style.display = 'none';
    var login = document.getElementById('enterIDTherapy');
    login.style.display = 'block';
    if(studentName !== 'back') {
      var search = studentName.search(' returned');
      if(search === -1) {
        let toast = this.toastCtrl.create({
          message: studentName + ' is off to therapy',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      } else {
        var sid = studentName.slice(0, search);
        let toast = this.toastCtrl.create({
          message: sid + ' returned from therapy',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }
    }
  }

}
