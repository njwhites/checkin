import { Component } from '@angular/core';
import {Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { StudentProvider } from "../../providers/student-provider";
import { StudentModel } from "../../models/db-models";
/*
  Generated class for the AdminStudentModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-admin-student-modal',
  templateUrl: 'admin-student-modal.html'
})
export class AdminStudentModalPage {
  student: StudentModel;
  studentForm;
  buttonText = "Update Student Info";
  constructor(public navParams: NavParams,
              public formBuilder: FormBuilder,
              public studentService: StudentProvider,
              public navController: NavController,
              public alertController: AlertController) {

    let ID = navParams.get("key");
    if(ID === "-1"){
      this.buttonText = "Add New Student";
    }
    let emptyStudent = new StudentModel();
    emptyStudent._id = "-1";
    emptyStudent.fName = "";
    emptyStudent.lName = "";
    emptyStudent.note = "";
    this.studentService.data.set("-1", emptyStudent);

    this.student = this.studentService.data.get(ID);
    this.studentForm = this.formBuilder.group({
      fName: [this.student.fName, Validators.required],
      lName: [this.student.lName, Validators.required],
      note: [this.student.note]
    });
  }

  ionViewDidLoad() {
  }

  updateStudent(){

    let hasChanged = false;
    if(this.student.fName != this.studentForm.value.fName){
      hasChanged = true;
    } else if(this.student.lName != this.studentForm.value.lName){
      hasChanged = true;
    } else if(this.student.note != this.studentForm.value.note){
      hasChanged = true;
    }
    if(hasChanged){
      this.student.fName = this.studentForm.value.fName;
      this.student.lName = this.studentForm.value.lName;
      this.student.note = this.studentForm.value.note;

      if(this.student._id === "-1"){
        this.studentService.createStudent(this.student).then((returnedID: String)=>{
          this.student._id = returnedID;
        });
        this.buttonText = "Update Student Info";
      } else {
        this.studentService.updateStudent(this.student);
      }
    }
  }

  dismiss(){
    this.navController.pop();
  }

  deleteStudent(){
    let deleteConfirmAlert = this.alertController.create({
      title: 'Confirm Delete',
      message: "Are you sure you want to delete " + this.student.fName + " " + this.student.lName,
      buttons: [{
        text: 'Cancel',
        role: 'Cancel',
        handler: ()=>{

        }
      },{
        text: 'Ok',
        handler: () => {
          // user has clicked the alert button
          // begin the alert's dismiss transition
          let navTransition = deleteConfirmAlert.dismiss();

          // start some async method
          let tempStudent = this.student;
          this.student = this.studentService.data.get("-1");
          this.studentService.deleteStudent(tempStudent).then(() => {
            // once the async operation has completed
            // then run the next nav transition after the
            // first transition has finished animating out

            this.navController.popToRoot();
            // navTransition.then(() => {
            //   this.dismiss();
            // });
          });
          return false;
        }
      }
    ]
    });

    deleteConfirmAlert.present();

  }

}
