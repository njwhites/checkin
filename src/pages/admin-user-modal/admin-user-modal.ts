import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserProvider } from "../../providers/user-provider";
import { UserModel } from "../../models/db-models";

@Component({
  selector: 'page-admin-user-modal',
  templateUrl: 'admin-user-modal.html'
})
export class AdminUserModalPage {
  //user is a data object to be displayed by the .html
  //userForm is the formGroup for input
  //button text is used to update the text on the "update" button according to whether the update would be an add or edit
  user: UserModel;
  userForm;
  buttonText = "Update User Info";

  constructor(public navParams: NavParams,
              public formBuilder: FormBuilder,
              public userService: UserProvider,
              public navController: NavController,
              public alertController: AlertController,
              public toastController: ToastController) {
    //For convenience set the ID to what the previous page supplied
    //this is the id corresponding to the user that was clicked
    let ID = navParams.get("key");

    //if the ID is -1 we are adding a new user, not editing so we should make that clear
    if(ID === "-1"){
      this.buttonText = "Add New User";
    }

    //For two-way binding purposes I add an empty user to the Map in the user provider
    let emptyUser = new UserModel();
    emptyUser._id = "-1";
    this.userService.data.set("-1", emptyUser);

    //Set the user data object to be equal to the corresponding user in the Map of the provider
    this.user = this.userService.data.get(ID);

    //set the form group to have all of the inputs that a user might need
    //require a full name and role, therapist type theroretically should be required
    //but that hasn't been strictly enforced due to the counter requirement that non-therapists have a null therapist role
    this.userForm = this.formBuilder.group({
      fName: [this.user.fName, Validators.required],
      lName: [this.user.lName, Validators.required],
      role: [this.user.role, Validators.required],
      phoneNumber: [this.user.phone],
      therapistType: [this.user.therapy_type]
    });
  }

  ionViewDidLoad() {
  }

  //when the user clicks on the add user or update user button (same button different text)
  updateUser(){

    //in order to save on accidental meaningless updates to the db
    //We check each form control and see if it is equal to the original value
    //if any of them aren't equal we can go ahead and update
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
      //set all of the user document values to be equal to the supplied inputs
      this.user.fName = this.userForm.value.fName;
      this.user.lName = this.userForm.value.lName;
      this.user.role = this.userForm.value.role;
      this.user.phone = this.userForm.value.phoneNumber;
      this.user.therapy_type = this.userForm.value.therapistType;

      //if the user isn't a therapist we want to make sure that their therapy type is null
      //only therapist's have a therapy type and other code might rely on that assumption
      if(this.user.role != "therapist" && this.user.therapy_type){
        this.user.therapy_type = "";
      }

      //if the user id is -1 we are adding a new user
      if(this.user._id === "-1"){
        //user service to create a new user, it will resolve the newly created user id
        //which happens to be the larges ID in the db +1
        //we then set the current user object equal to that id
        this.userService.createUserByDoc(this.user).then((returnedID: String)=>{
          this.user._id = returnedID;
        });

        //the map object in the user provider has some new data for value -1
        //we want to go back and make sure the map object associates -1 with the "empty user"
        let emptyUser = new UserModel();
        emptyUser._id = "-1";
        this.userService.data.set("-1", emptyUser);

        //now that we have added this user we want the button to say update instead of add
        this.buttonText = "Update User Info";

        //a little toast to let the admin know they have just made a user
        //without this feedback the button felt like it did nothing
        this.toastController.create({
          message: this.user.fName+ " " + this.user.lName + " has been added as a user.",
          duration: 3000,
          position: "bottom"
        }).present();

        //if they aren't an add then we just update the existing doc, and similarly give the admin feedback
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

  //mainly used if we decide to make this a modal instead of a new page
  //for now this is unused and may need to be switched to a view control dismiss if modals are preferred
  dismiss(){
    this.navController.pop();
  }

  deleteUser(){

    //present the user with an alert so that they don't accidently delete someone
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

          //this would be used for a modal version instead of a page version
          //this navTransition gives us some control over the order in which pages transition
          //said control is important for the asynchronous nature and page removal
          //let navTransition = 
          deleteConfirmAlert.dismiss();


          //use a tempUser for deletion, and then set the user data object as the empty user
          //this is so the two way binding doesn't get angry when we delete their expected user from the Map object
          let tempUser = this.user;
          this.user = this.userService.data.get("-1");

          //delete the user and then pop this page away
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
