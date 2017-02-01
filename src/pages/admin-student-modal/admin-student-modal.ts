import { Component } from '@angular/core';
import {Validators, FormBuilder, FormControl} from '@angular/forms';
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
    let isNewStudent = false;
    if(ID === "-1"){
      this.buttonText = "Add New Student";
      isNewStudent = true;
    }
    let emptyStudent = new StudentModel();
    emptyStudent._id = "-1";
    this.studentService.data.set("-1", emptyStudent);


    this.student = this.studentService.data.get(ID);
    this.studentForm = this.formBuilder.group({
      ID: [this.student._id,
           Validators.compose([Validators.required, (control: FormControl)=>{
             const controlID = control.value;
             // console.log("this is in the validator");
             // console.log(control.value);
             if(controlID === "-1"){
               return null;
             }

             if(this.studentService){
               if(this.studentService.data){
                 if(isNewStudent){
                   return (this.studentService.data.get(controlID) === undefined) ? null : {collision: true};
                 } else {
                   return null;
                 }
               } else {
                 return { nodata: true};
               }
             } else {
               return {noservice: true};
             }
           }, (control: FormControl)=>{
             if(control.value === "-1"){
               return null;
             } else if(!isNaN(Number(control.value))){
               return (control.value < 0 ) ? {notPositiveNumber:true}: null;
             } else {
               return {notPositiveNumber:true}
             }
           } ])],
      fName: [this.student.fName, Validators.required],
      lName: [this.student.lName, Validators.required],
      note: [this.student.note],
      dietaryNeeds: [this.student.dietNeed]
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
    } else if(this.student.dietNeed != this.studentForm.value.dietaryNeeds){
      hasChanged = true;
    }
    if(hasChanged){
      this.student.fName = this.studentForm.value.fName;
      this.student.lName = this.studentForm.value.lName;
      this.student.note = this.studentForm.value.note;
      this.student.dietNeed = this.studentForm.value.dietaryNeeds;



      if(this.student._id === "-1"){
        let returnedID;
        this.student._id = this.studentForm.value.ID;
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
      this.dismiss();
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
