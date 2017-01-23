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

  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }
}
