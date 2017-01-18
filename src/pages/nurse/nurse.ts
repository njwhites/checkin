import {Component} from '@angular/core';
import {NavController, ToastController, NavParams} from 'ionic-angular';
import {ListPage} from '../list/list';

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
      this.navCtrl.push(ListPage, {
        roomNumber: this.roomNumber,
        parentPage: 'nurse',
        userID: this.userID
      });
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
      var search = studentName.search(' returned');
      if(search === -1) {
        let toast = this.toastCtrl.create({
          message: studentName + ' is off to the nurse',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      } else {
        var sid = studentName.slice(0, search);
        let toast = this.toastCtrl.create({
          message: sid + ' returned from the nurse',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }
    }
  }

}
