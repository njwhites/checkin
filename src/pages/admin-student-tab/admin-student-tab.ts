import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { StudentProvider } from '../../providers/student-provider';
import { AdminStudentModalPage } from '../admin-student-modal/admin-student-modal';


@Component({
  selector: 'page-admin-student-tab',
  templateUrl: 'admin-student-tab.html'
})
export class AdminStudentTabPage {

  private filter: string = " ";

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public studentService: StudentProvider) {
    this.filter=" ";
  }

  ionViewDidLoad() {
  }

  studentClicked(ID: String){
    this.navCtrl.push(AdminStudentModalPage, {key: ID});
  }

  homeButtonClicked(){
    //this.navCtrl.parent.parent gets us the navCtrl for
    // the page encompassing the tabs, and so poping to
    // root on that will take you to the original root
    // page of the app
    this.navCtrl.parent.parent.popToRoot();
  }
  addStudent(){
    this.navCtrl.push(AdminStudentModalPage, {key: "-1"});
  }
  setFilter(event){
    this.filter = event.target.value;
    if(this.filter === ''){
      this.filter = ' ';
    }
  }
}
