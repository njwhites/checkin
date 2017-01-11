import {Component} from '@angular/core';
import {NavController, ToastController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  userID: number;
  roomNumber: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.roomNumber = navParams.data;
  }


  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      this.userID = idCheck;
      var login = document.getElementById('enterIDSignin');
      login.style.display = 'none';
      var list = document.getElementById('studentListSignin');
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

  revert(students:Array<string>):void {
    var list = document.getElementById('studentListSignin');
    list.style.display = 'none';
    var login = document.getElementById('enterIDSignin');
    login.style.display = 'block';
    if(students[0] !== 'back') {
      let toast = this.toastCtrl.create({
        message: students.length + ' student(s) checked in!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

  ionViewDidLoad() {
  }

}
