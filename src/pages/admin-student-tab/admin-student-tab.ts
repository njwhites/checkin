import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { StudentProvider } from '../../providers/student-provider';
import { AdminStudentModalPage } from '../admin-student-modal/admin-student-modal';

/*
  Generated class for the AdminStudentTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-student-tab',
  templateUrl: 'admin-student-tab.html'
})
export class AdminStudentTabPage {

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public studentService: StudentProvider) {}

  ionViewDidLoad() {
  }

  studentClicked(ID: String){
    this.navCtrl.push(AdminStudentModalPage, {key: ID});
  }

  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }
  addStudent(){
    this.navCtrl.push(AdminStudentModalPage, {key: "-1"});
  }
}
