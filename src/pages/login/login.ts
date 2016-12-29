import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {StudentCheckinPage} from "../student-checkin/student-checkin";


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

  onSelectClassroom(roomNumber) {
    console.log(roomNumber);
    //TODO: here is where we will pass the params of the room number in.
    this.navCtrl.push(this.classroomPage);
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
