import {Component} from '@angular/core';
import {NavController, ToastController, NavParams} from 'ionic-angular';
import {ListPage} from '../list/list';


@Component({
  selector: 'page-present-students',
  templateUrl: 'present-students.html'
})
export class PresentStudentsPage {
  userID: number;
  roomNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.roomNumber = navParams.data;
  }

  ionViewDidLoad() {
  }

/*******************************************************************************
 * onNotify
 *
 * takes in the ID and if its a valid ID will push to the correct page, if not
 * it toasts that the ID was incorrect
 *
 * @param idCheck
 **/
  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      this.userID = idCheck;
      this.navCtrl.push(ListPage, {
        roomNumber: this.roomNumber,
        parentPage: 'presentStudents',
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

/*******************************************************************************
 * homeButtonClicked
 *
 * pops to the splash screen
 *
 **/
  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }

}
