import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ClassRoomProvider } from "../../providers/class-room-provider";
import { StudentProvider } from "../../providers/student-provider";
import { ClassRoomModel } from "../../models/db-models";
import { AdminClassroomModalPage } from "../admin-classroom-modal/admin-classroom-modal";

@Component({
  selector: 'page-admin-classroom-tab',
  templateUrl: 'admin-classroom-tab.html'
})
export class AdminClassroomTabPage {

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public studentService: StudentProvider,
              public classRoomService: ClassRoomProvider) {
  }

  addClassroom(){
    this.modalController.create(AdminClassroomModalPage,{isAddNewClassroom:true}).present();
  }

  showClassRoomInfo(classroom: ClassRoomModel){
    this.modalController.create(AdminClassroomModalPage,{classroom: classroom, isAddNewClassroom: false}).present();
  }


}
