import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {KitchenPage} from "../kitchen/kitchen";
import {TherapistPage} from "../therapist/therapist";
import {AdminPage} from "../admin/admin";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  classroomPage = ClassroomPage;
  kitchenPage = KitchenPage;
  therapistPage = TherapistPage;
  adminPage = AdminPage;
  btnPage: string;
  room: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.room = navParams.get('room');
  }

  onSelectClassroom(roomNumber) {
    //console.log(roomNumber);
    //TODO: here is where we will pass the params of the room number in.
    this.navCtrl.push(this.classroomPage, {roomNumber: roomNumber});
  }

  toLogin(userRole) {
    this.btnPage = userRole;
    document.getElementById('buttonGrid').style.display = 'none';
    document.getElementById('enterID').style.display = 'block';
  }

  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      if(this.btnPage == 'kitchen') {
        this.navCtrl.push(this.kitchenPage);
      } else if(this.btnPage == 'therapist') {
        this.navCtrl.push(this.therapistPage);
      } else if(this.btnPage == 'admin') {
        this.navCtrl.push(this.adminPage);
      }
        } else {
      document.getElementById('enterID').style.display = 'none';
      document.getElementById('buttonGrid').style.display = 'block';
      let toast = this.toastCtrl.create({
        message: 'Invalid ID',
        duration: 1500,
        position: 'bottom'
      });
      toast.present(toast);
      this.btnPage = '';
    }
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
