import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { ClassRoomModel } from '../../models/db-models';
import { StudentProvider } from '../../providers/student-provider';
import { UserProvider } from '../../providers/user-provider';
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
  isAddNewClassroom: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public studentService: StudentProvider,
              public userService: UserProvider,
              public classroomService: ClassRoomProvider,
              public formBuilder: FormBuilder,
              public alertController: AlertController,
              public modalController: ModalController,
              public toastController: ToastController) {
    this.isAddNewClassroom = navParams.get("isAddNewClassroom");

    if(!this.isAddNewClassroom){
      this.classroom=this.classroomService.data.get(navParams.get("classroom")._id);
      this.classroomForm = this.formBuilder.group({
        teacher: [this.classroom.teacher, Validators.required]
      });
    } else {
      this.classroomForm = this.formBuilder.group({
        roomNumber: ["",
          Validators.compose([Validators.required, (control: FormControl)=>{
              return (this.classroomService.data.get(control.value) === undefined) ? null : {collision: true};
          }, (control: FormControl)=>{
            if(!isNaN(Number(control.value))){
              return (control.value < 0 ) ? {notPositiveNumber:true}: null;
            } else {
              return {notPositiveNumber:true}
            }
          }])
        ],
        teacher: ["", Validators.required]
      })
    }
  }

  ionViewDidLoad() {
  }

  addClassroom(){
    let newRoom = new ClassRoomModel();
    newRoom._id = this.classroomForm.value.roomNumber;
    newRoom.roomNumber = this.classroomForm.value.roomNumber;
    newRoom.teacher = this.classroomForm.value.teacher;
    newRoom.aides = new Array<string>();
    newRoom.students = new Array<string>();

    this.classroomService.createClassroom(newRoom);
    this.dismiss();
  }

  updateClassroom(){
    if(this.classroom.teacher != this.classroomForm.value.teacher){
      this.classroom.teacher = this.classroomForm.value.teacher;
      this.classroomService.updateClassRoom(this.classroom);
    }
    this.toastController.create({
      message: this.classroom._id + " has been updated.",
      duration: 3000,
      position: "bottom"
    }).present();
    this.dismiss();
  }

  deleteClassroom(){
    console.log("tried to delete room " + this.classroom._id);
    this.dismiss();
    this.classroomService.deleteClassRoom(this.classroom);
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
    this.modalController.create(ClassroomAddModalPage,{currentroom: this.classroom, isStudentAdd: true}).present();
  }

  removeAide(userID){

    //ask the  classroom provider to remove the aide from the classroom
    this.classroomService.removeAideFromClass(this.classroom, userID);

    this.classroom.aides.splice(this.classroom.aides.indexOf(userID), 1);
  }

  addAideModal(){
    this.modalController.create(ClassroomAddModalPage,{currentroom: this.classroom, isStudentAdd: false}).present();
  }

  dismiss(){
      this.navCtrl.pop();
  }

}
