import { Component } from '@angular/core';
import {Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ClassRoomModel } from '../../models/db-models';
import { StudentProvider } from '../../providers/student-provider';
import { ClassRoomProvider } from '../../providers/class-room-provider';

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
              public alertController: AlertController) {
    this.classroom=navParams.get("classroom");

    this.classroomForm = this.formBuilder.group({
      teacher: [this.classroom.teacher]
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

  removeStudent(SID){
    this.classroomService.removeStudentFromClass(this.classroom, SID);

    this.classroomService.getClassRoomByID("-1").then((classroom:ClassRoomModel)=>{
      this.classroomService.addStudentToClass(classroom, SID);
    });
  }

  addStudentAlert(){
    console.log("tried to add student");

    let alert = this.alertController.create({
      title: 'Select Students To Add'
    });
    Array.from(this.studentService.data.values()).filter((value)=>{
      return this.classroom.students.indexOf(value._id)<0;
    }).forEach((value, index, array)=>{
      //pick one of the below input or button
      alert.addInput({
            type: 'checkbox',
            label: value.fName + ' ' + value.lName,
            value: ''+value._id
          });


      // alert.addButton({
      //   text: value.roomNumber,
      //   handler: ()=>{
      //     this.onSelectClassroom(value.roomNumber);
      //   }
      // })
    });
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: ()=>{

      }
    })
    alert.addButton({
      text: "Okay",
      handler: (data)=>{
        console.log(data);
        data.forEach((value)=>{this.addStudent(value)});
      }
    })
    alert.present();

  }

  addStudent(SID){
    let previousRoom: ClassRoomModel;
    this.classroomService.getAllClassRooms().then((classrooms:Array<ClassRoomModel>)=>{
      previousRoom = classrooms.find((value)=>{return value.students.indexOf(SID) >= 0});

      this.classroomService.removeStudentFromClass(previousRoom, SID);
    });

    this.classroomService.addStudentToClass(this.classroom, SID);

  }

  dismiss(){
    this.navCtrl.pop();
  }

}
