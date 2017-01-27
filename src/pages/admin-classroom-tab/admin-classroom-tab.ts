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

  classrooms: Array<ClassRoomModel>;

  constructor(public navCtrl: NavController,
              public modalController: ModalController,
              public studentService: StudentProvider,
              public classRoomService: ClassRoomProvider) {
                
    classRoomService.getAllClassRooms().then((data: Array<ClassRoomModel>) =>{
      this.classrooms = data;
    })
  }

  addClassroom(){
    console.log("click");

  }

  showClassRoomInfo(classID: string){

    this.modalController.create(AdminClassroomModalPage,{classroom: this.classrooms.filter((value)=>{return value._id===classID})[0]}).present();
  }

  ionViewDidLoad() {
  }

}
