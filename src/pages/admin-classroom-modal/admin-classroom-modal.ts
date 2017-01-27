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
  }

  //Chris 1/27/17 this method of adding students involves opening an alert and selecting students from there
  //might be replaced with another modal or page that is more similar to the therapist add page
  addStudentAlert(){
    console.log("tried to add student");

    //create the alert to display optional students
    let alert = this.alertController.create({
      title: 'Select Students To Add'
    });

    //build an array of students that don't already belong to the classroom we are in
    Array.from(this.studentService.data.values()).filter((value)=>{
      return this.classroom.students.indexOf(value._id)<0;

      //for each student add a checkbox to the alert
    }).forEach((value, index, array)=>{
      //pick one of the below input or button
      alert.addInput({
        type: 'checkbox',
        label: value.fName + ' ' + value.lName,
        value: ''+value._id
      });
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

  //function that takes in a student id and requests that the classroom provider add it to the class
  addStudent(SID){
    //for tracking and maybe user feedback purposes
    //save the previous room for future display
    let previousRoom: ClassRoomModel;

    //first we want to get the student from the previous room and remove them
    this.classroomService.getAllClassRooms().then((classrooms:Array<ClassRoomModel>)=>{
      previousRoom = classrooms.find((value)=>{return value.students.indexOf(SID) >= 0});

      this.classroomService.removeStudentFromClass(previousRoom, SID);
    });

    //now we add the student to the current room
    this.classroomService.addStudentToClass(this.classroom, SID);

  }

  dismiss(){
    this.navCtrl.pop();
  }

}
