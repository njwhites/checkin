import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { ClassRoomModel } from '../../models/db-models';
import { StudentProvider } from '../../providers/student-provider';
import { ClassRoomProvider } from '../../providers/class-room-provider';
import { ClassroomAddModalPage } from '../classroom-add-modal/classroom-add-modal';

@Component({
  selector: 'page-admin-classroom-modal',
  templateUrl: 'admin-classroom-modal.html'
})
export class AdminClassroomModalPage {
  classroom: ClassRoomModel;
  classroomForm;
  buttonText = "Update classroom";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public studentService: StudentProvider,
              public classroomService: ClassRoomProvider,
              public formBuilder: FormBuilder,
              public alertController: AlertController,
              public modalController: ModalController) {
    this.classroom=navParams.get("classroom");

    this.classroomForm = this.formBuilder.group({
      teacher: [this.classroom.teacher, Validators.required]
    });
  }

  ionViewDidLoad() {
  }

  updateClassroom(){
    console.log("tried to update room " + this.classroom._id);
  }

  deleteClassroom(){
    console.log("tried to delete room " + this.classroom._id);
  }

  //remove a student from a class room
  //takes as input the student id for the student to be removed from the classroom
  removeStudent(SID){
    //ask the classroom provider to remove the student by passing it the classroom to remove from and the student id to remove
    this.classroomService.removeStudentFromClass(this.classroom, SID);

    //now that the student is removed from the class room we should add them to the "unallocated" classroom which is id'd by -1
    //then pass the classroom service the "unallocated" classroom and student id to add together
    this.classroomService.getClassRoomByID("-1").then((classroom:ClassRoomModel)=>{
      this.classroomService.addStudentToClass(classroom, SID);
    });

    this.classroom.students.splice(this.classroom.students.indexOf(SID), 1);
  }

  addStudentModal(){
    this.modalController.create(ClassroomAddModalPage,{currentroom: this.classroom}).present();

  }

  dismiss(){
    this.navCtrl.pop();
  }

}
