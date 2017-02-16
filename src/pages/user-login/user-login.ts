import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {KitchenPage} from "../kitchen/kitchen";
import {TherapistPage} from "../therapist/therapist";
import {AdminPage} from "../admin/admin";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";

@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html'
})
export class UserLoginPage {
  parentPage: string;
  kitchenPage = KitchenPage;
  therapistPage = TherapistPage;
  adminPage = AdminPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public studentService: StudentProvider, public userService: UserProvider, public toastCtrl: ToastController) {
    this.parentPage = this.navParams.get('parentPage');
  }

  /*******************************************************************************
   * onNotify
   *
   * takes in the ID and if its a valid ID will push to the correct page, if not
   * it toasts that the ID was incorrect (only used for kitchen, therapist and
   * admin pages from the initial splash screen)
   *
   * @param idCheck
   **/
  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      if(this.parentPage === 'kitchen') {
        this.studentService.getStudents().then(()=>{
          this.navCtrl.push(this.kitchenPage);
        });
      } else if(this.parentPage == 'therapist') {
        this.studentService.getStudents().then(()=>{
          this.userService.getAllUsers().then(()=>{
            this.navCtrl.push(this.therapistPage, idCheck);
          });
        });
      } else if(this.parentPage == 'admin') {
        this.studentService.getStudents().then(()=>{
          this.userService.getAllUsers().then(()=>{
            this.navCtrl.push(this.adminPage, idCheck);
          });
        });
      }
    } else {
      let toast = this.toastCtrl.create({
        message: 'Invalid ID',
        duration: 1500,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }
}
