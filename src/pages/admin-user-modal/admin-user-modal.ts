import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserProvider } from "../../providers/user-provider";
import { UserModel } from "../../models/db-models";

/*
  Generated class for the AdminUserModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-user-modal',
  templateUrl: 'admin-user-modal.html'
})
export class AdminUserModalPage {
  user: UserModel;
  userForm;
  buttonText = "Update User Info";
  constructor(public navParams: NavParams,
              public formBuilder: FormBuilder,
              public userService: UserProvider,
              public navController: NavController,
              public alertController: AlertController,
              public toastController: ToastController) {

    let ID = navParams.get("key");
    if(ID === "-1"){
      this.buttonText = "Add New User";
    }
    let emptyUser = new UserModel();
    this.userService.data.set("-1", emptyUser);

    this.user = this.userService.data.get(ID);

    this.userForm = this.formBuilder.group({
      fName: [this.user.fName, Validators.required],
      lName: [this.user.lName, Validators.required],
      role: [this.user.role, Validators.required],
      phoneNumber: [this.user.phone],
      therapistType: [this.user.therapy_type]
    });
  }

  ionViewDidLoad() {
    console.log('Hello AdminUserModalPage Page');
  }

  updateUser(){

    let hasChanged = false;
    if(this.user.fName != this.userForm.value.fName){
      hasChanged = true;
    } else if(this.user.lName != this.userForm.value.lName){
      hasChanged = true;
    } else if(this.user.role != this.userForm.value.role){
      hasChanged = true;
    } else if(this.user.phone != this.userForm.value.phoneNumber){
      hasChanged = true;
    } else if(this.user.therapy_type != this.userForm.value.therapistType){
      hasChanged = true;
    }
    if(hasChanged){
      this.user.fName = this.userForm.value.fName;
      this.user.lName = this.userForm.value.lName;
      this.user.role = this.userForm.value.role;
      this.user.phone = this.userForm.value.phoneNumber;
      this.user.therapy_type = this.userForm.value.therapistType;

      if(this.user.role != "therapist" && this.user.therapy_type){
        this.user.therapy_type = "";
      }

      if(this.user._id === "-1"){
        this.userService.createUserByDoc(this.user).then((returnedID: String)=>{
          this.user._id = returnedID;
        });
        this.buttonText = "Update User Info";

        this.toastController.create({
          message: this.user.fName+ " " + this.user.lName + " has been added as a user.",
          duration: 3000,
          position: "bottom"
        }).present();
      } else {
        this.userService.updateUser(this.user);

        this.toastController.create({
          message: this.user.fName+ " " + this.user.lName + " has been updated.",
          duration: 3000,
          position: "bottom"
        }).present();
      }
    }
  }

  dismiss(){
    this.navController.pop();
  }

  deleteUser(){
    let deleteConfirmAlert = this.alertController.create({
      title: 'Confirm Delete',
      message: "Are you sure you want to delete " + this.user.fName + " " + this.user.lName,
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
          let tempUser = this.user;
          this.user = this.userService.data.get("-1");
          this.userService.deleteUserByDoc(tempUser).then(() => {
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
