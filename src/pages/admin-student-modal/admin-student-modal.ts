import { Component } from '@angular/core';
import {Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { StudentProvider } from "../../providers/student-provider";
import { StudentModel } from "../../models/db-models";


//---------------------------------------------------------
//For a commented description of this code see
//      admin-user-modal.ts
// that file and this one follow nearly identical procedure
//---------------------------------------------------------


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
              public alertController: AlertController,
              public toastController: ToastController) {

    let ID = navParams.get("key");
    if(ID === "-1"){
      this.buttonText = "Add New Student";
    }
    let emptyStudent = new StudentModel();
    emptyStudent._id = "-1";
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
        let emptyStudent = new StudentModel();
        emptyStudent._id = "-1";
        this.studentService.data.set("-1", emptyStudent);
        this.buttonText = "Update Student Info";
        this.toastController.create({
          message: this.student.fName+ " " + this.student.lName + " has been added as a user.",
          duration: 3000,
          position: "bottom"
        }).present();
      } else {
        this.studentService.updateStudent(this.student);
        this.toastController.create({
          message: this.student.fName+ " " + this.student.lName + " has been updated.",
          duration: 3000,
          position: "bottom"
        }).present();
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
