import { Component } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { UserProvider } from "../../providers/user-provider";
import { UserModel } from "../../models/db-models";
import { StudentProvider } from "../../providers/student-provider";
import { UserAddModalPage } from "../user-add-modal/user-add-modal";
import { ClassRoomProvider } from "../../providers/class-room-provider";
import { AuthProvider } from "../../providers/auth-provider";

@Component({
  selector: 'page-admin-user-modal',
  templateUrl: 'admin-user-modal.html'
})
export class AdminUserModalPage {
  //user is a data object to be displayed by the .html
  //userForm is the formGroup for input
  //button text is used to update the text on the "update" button according to whether the update would be an add or edit
  user: UserModel;
  userForm: FormGroup = new FormGroup({});
  buttonText = "Update User Info";
  logged_in_id;

  constructor(public navParams: NavParams,
              public formBuilder: FormBuilder,
              public userService: UserProvider,
              public studentService: StudentProvider,
              public classroomService: ClassRoomProvider,
              public authService: AuthProvider,
              public navController: NavController,
              public alertController: AlertController,
              public toastController: ToastController,
              public modalController: ModalController) {
    //For convenience set the ID to what the previous page supplied
    //this is the id corresponding to the user that was clicked
    //if it was add a new user then the ID is -1 and we will use isNewUser for logic later
    this.logged_in_id = navParams.get("admin_id");
    let ID = navParams.get("key");
    let isNewUser = false;

    //if the ID is -1 we are adding a new user, not editing so we should make that clear
    if(ID === "-1"){
      this.buttonText = "Add New User";
      isNewUser = true;
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
    this.userForm = new FormGroup({
      role: new FormControl(),
    });
    this.userForm = this.formBuilder.group({
      ID: [this.user._id,
        //3 validators composed together, the first is to make sure that the id exists
        //the second is to make sure that the id isn't already taken
        //and the third is to make sure it is a positive number
        //there is some exceptions right now where if it is a new user -1 is allowed as the "take the next available" ID
        Validators.compose([Validators.required, (control: FormControl)=>{

          const controlID = control.value;
          // console.log("this is in the validator");
          // console.log(control.value);
          if(controlID === "-1"){
            return null;
          }

          if(this.userService){
            if(this.userService.data){
              if(isNewUser){
                return (this.userService.data.get(controlID) === undefined) ? null : {collision: true};
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
      fName: [this.user.fName, Validators.required],
      lName: [this.user.lName, Validators.required],
      role: [this.user.role, Validators.required],
      phoneNumber: [this.user.phone],
      therapistType: [this.user.therapy_type],
      email: [this.user.email,
        Validators.compose([
          (control: FormControl)=>{
            if(this.userForm.controls['role'].value === this.userService.ROLES[0]){
              return (control.value === "") ? {required: true} : null;
            }
            return null;
          },Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
          (control: FormControl)=>{
            let returnObject = null;
            if(this.user.email === control.value){
              return returnObject;
            }
            this.userService.data.forEach((doc)=>{
              if(Number(doc._id) >= 0){
                //March 2, 2017
                //Added to lower case because the check on login is also on lowercase
                if(control.value && doc.email && doc.email.toLowerCase() === control.value.toLowerCase()){
                  returnObject = { emailTaken: true};
                }
              }
            })
            return returnObject;
          }
        ])
      ],
      password: ['', (control: FormControl)=>{
        if(Number(this.user._id) >= 0){
          return null;
        }
        if(this.userForm.controls['role'].value === this.userService.ROLES[0]){
          return (control.value === "") ? {required: true} : null;
        }
        return null;
      }],
      confirmPassword: ['', (control: FormControl)=>{
        if(Number(this.user._id) >= 0){
          return null;
        }
        if(this.userForm.controls['role'].value === this.userService.ROLES[0]){
          return (control.value === "") ? {required: true} : null;
        }
        return null;
      }],
      question: ['', Validators.compose([
        (control: FormControl)=>{
          if(Number(this.user._id) >= 0){
            return null;
          }
          if(this.userForm.controls['role'].value === this.userService.ROLES[0]){
            return (control.value === "") ? {required: true} : null;
          }
          return null;
        },
        (control: FormControl)=>{
          return (control.value.length >= 40) ?
            {fortyCharacters: true} : null;
        }
      ])],
      answer: ['', (control: FormControl)=>{
        if(Number(this.user._id) >= 0){
          return null;
        }
        if(this.userForm.controls['role'].value === this.userService.ROLES[0]){
          return (control.value === "") ? {required: true} : null;
        }
        return null;
      }],
    }, {validator: Validators.compose([
      this.notMatchingValidator('password','confirmPassword'),
      this.matchingValidator('password','question')
    ])
  });
  }

  matchingValidator(field1: string, field2: string){
    return(group: FormGroup): {[key: string]: any} =>{
      if(Number(this.user._id) >= 0){
        return null;
      }
      let field1Control = group.controls[field1];
      let field2Control = group.controls[field2];
      return (field1Control.value === field2Control.value) ?
        {matching: true} : null;
    }
  }

  notMatchingValidator(field1: string, field2: string){
    return (group: FormGroup): {[key: string]: any} => {
      if(Number(this.user._id) >= 0){
        return null;
      }
      let field1Control = group.controls[field1];
      let field2Control = group.controls[field2];

      return (field1Control.value !== field2Control.value) ?
        {notMatching: true} : null;
    }
  }

  ionViewDidLoad() {
  }

  //when the user clicks on the add user or update user button (same button different text)
  updateUser(){

    //in order to save on accidental meaningless updates to the db
    //We check each form control and see if it is equal to the original value
    //if any of them aren't equal we can go ahead and update
    let hasChanged = false;
    if(this.user.fName !== this.userForm.value.fName){
      hasChanged = true;
    } else if(this.user.lName !== this.userForm.value.lName){
      hasChanged = true;
    } else if(this.user.role !== this.userForm.value.role){
      hasChanged = true;
    } else if(this.user.phone !== this.userForm.value.phoneNumber){
      hasChanged = true;
    } else if(this.user.therapy_type !== this.userForm.value.therapistType){
      hasChanged = true;
    } else if(this.user.email !== this.userForm.value.email){
      hasChanged = true;
    }
    if(hasChanged){
      //set all of the user document values to be equal to the supplied inputs
      this.user.fName = this.userForm.value.fName;
      this.user.lName = this.userForm.value.lName;
      this.user.role = this.userForm.value.role;
      this.user.phone = this.userForm.value.phoneNumber;
      this.user.therapy_type = this.userForm.value.therapistType;
      this.user.email = this.userForm.value.email;

      //if the user isn't a therapist we want to make sure that their therapy type is null
      //only therapist's have a therapy type and other code might rely on that assumption
      if(this.user.role !== "therapist" && this.user.therapy_type){
        this.user.therapy_type = "";
      }

      if(this.user.role.toLowerCase() !== 'admin'){
        this.user.email = "";
      }

      //if the user id is -1 we are adding a new user
      if(this.user._id === "-1"){
        //user service to create a new user, it will resolve the newly created user id
        //which happens to be the larges ID in the db +1
        //we then set the current user object equal to that id

        //alternately if the user supplies a positive number that isn't taken, then we will assign the new user with that id
        this.user._id = this.userForm.value.ID;
        this.userService.createUserByDoc(this.user).then((returnedID: String)=>{
          this.user._id = returnedID;

          if(this.user.role.toLowerCase() === 'admin'){
            //write to authservice
            this.authService.setPassword(this.user._id + "", this.userForm.value.password).then(() => {
              this.authService.setPasswordQuestion(this.user._id + "", this.userForm.value.question, this.userForm.value.answer);
            });
          }
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

        if(this.user.role.toLowerCase() === 'admin'){
          //write to authservice
          //this.authService.setPassword(this.user._id + "", this.userForm.value.password);
        }

        this.toastController.create({
          message: this.user.fName+ " " + this.user.lName + " has been updated.",
          duration: 3000,
          position: "bottom"
        }).present();
      }
      this.dismiss();
    }
  }

  //mainly used if we decide to make this a modal instead of a new page
  //for now this is unused and may need to be switched to a view control dismiss if modals are preferred
  dismiss(){
    this.navController.pop();
  }

  deleteUser(){

    //present the user with an alert so that they don't accidently delete someone
    console.log(this.logged_in_id + " " + this.user._id)
    if(this.logged_in_id + "" === this.user._id + ""){
      //Alert that you can't delete youself
      console.log("thou can'st'd've delete thine self");
    }else{
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
              if(tempUser.role === 'admin'){
                this.authService.deletePasswordByID(tempUser._id);
              }
              // once the async operation has completed
              // then run the next nav transition after the
              // first transition has finished animating out

              //remove the aide from any classes
              this.classroomService.removeAide(<string>(tempUser._id));

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

  addApprovedStudent(){
    this.user.fName = this.userForm.value.fName;
    this.user.lName = this.userForm.value.lName;
    this.modalController.create(UserAddModalPage,{user: this.user}).present();
  }

  removeApprovedStudent(SID: String){
    this.userService.removeVisibleStudent(this.user, SID);
    this.user.visible_students.splice(this.user.visible_students.indexOf(SID),1);
  }

}
