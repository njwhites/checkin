import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";
import {ClassRoomModel, UserModel} from "../../models/db-models";

@Component({
  selector: 'page-user-add-modal',
  templateUrl: 'user-add-modal.html'
})
export class UserAddModalPage {

  classrooms: Array<ClassRoomModel>;
  approvedStudents: Array<String>;
  user: UserModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public classRoomService: ClassRoomProvider,
              public studentService: StudentProvider,
              public userService: UserProvider,
              public toastCtrl: ToastController) {
    this.classRoomService.getAllClassRooms().then((data) =>{
      this.classrooms = <Array<ClassRoomModel>>data;
    });
    this.user = navParams.get('user');
    if(!this.user.visible_students){
      this.user.visible_students= new Array<String>();
    }
    this.approvedStudents = <Array<String>>this.user.visible_students;
  }

  ionViewDidLoad() {
    console.log('Hello UserAddModalPage Page');
  }

  dismiss(){
    this.navCtrl.pop();
  }

  toggleDropDown(id) {
    let dividerId = "classroom_" + id;
    let buttonUpId = "upButton_" + id;
    let buttonDownId = "downButton_" + id;
    if (!document.getElementById(dividerId).hidden){
      document.getElementById(dividerId).hidden = true;
      document.getElementById(buttonUpId).hidden = true;
      document.getElementById(buttonDownId).hidden = false;
    } else {
      document.getElementById(dividerId).hidden = false;
      document.getElementById(buttonUpId).hidden = false;
      document.getElementById(buttonDownId).hidden = true;
    }
  }


  addApprovedStudent(SID) {
    //now we add the student to the user's list of approved students
    this.userService.addVisibleStudent(this.user, SID);
    this.user.visible_students.push(SID);

    //update the ui and let the user know
    document.getElementById("student_" + SID).hidden = true;
    let toast = this.toastCtrl.create({
      message: this.studentService.data.get(SID).fName.toString() + " " + this.studentService.data.get(SID).lName.toString() + " added to user " + this.user.fName + " " + this.user.lName,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  isClassroomSubsetOfThis(classroom): boolean{
    return classroom.students.every((value)=>{return this.user.visible_students.indexOf(value) >= 0})
  }
}
