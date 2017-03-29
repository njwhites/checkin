import {Component} from "@angular/core";
import {NavController, NavParams, ToastController, LoadingController, AlertController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {KitchenPage} from "../kitchen/kitchen";
import {TherapistPage} from "../therapist/therapist";
import {AdminPage} from "../admin/admin";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";
import {CheckinProvider} from "../../providers/checkin-provider";
import {ConstantsProvider} from "../../providers/constants-provider";
import {LoggingProvider} from "../../providers/logging-provider";
import {ClassRoomModel} from "../../models/db-models";
import {UserLoginPage} from "../user-login/user-login";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  classroomPage = ClassroomPage;
  kitchenPage = KitchenPage;
  therapistPage = TherapistPage;
  adminPage = AdminPage;
  btnPage: string;
  room: any;
  classrooms: Array<ClassRoomModel>;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public loadingcontroller: LoadingController,
              public classRoomService: ClassRoomProvider, public studentService: StudentProvider, public userService: UserProvider,
              public checkinService: CheckinProvider, public alertController: AlertController, constantsService: ConstantsProvider,
              ) {
    this.room = navParams.get('room');
    //try to estabilish an initial connection to db's
    this.classRoomService.forceInit();
    this.studentService.forceInit();
    this.userService.forceInit();
    let loader = loadingcontroller.create({
      content: "Loading your app now!",
      duration: 3000
    });
    loader.onDidDismiss(()=>{
      this.classRoomService.getAllClassRooms().then((data: Map<String, ClassRoomModel>) =>{
        this.classrooms = Array.from(data.values());
      });
    })
    loader.present();

    }

  ionViewDidEnter(){
    this.classRoomService.selectedClassroom = null;
    // this.classRoomService.getAllClassRooms().then((data) => {
    //   this.classrooms = <Array<ClassRoomModel>>data;
    // });
  }

  onSelectClassroom(id) {

    //******************************************************************
    //testing to see if class room selection works
    //******************************************************************
    if(id){
      this.classRoomService.selectedClassroom = id;
      this.userService.getAllUsers().then(output =>{
        this.studentService.getStudentsByGroup(this.classRoomService.data.get(id).students).then(result =>{
          this.navCtrl.push(this.classroomPage, {roomNumber: this.classRoomService.data.get(id).roomNumber});
        });
      });
    } else{
      let toast = this.toastCtrl.create({
        message: "Please select a room",
        position: "bottom",
        duration: 3000
      })
      toast.present();
    }

    //******************************************************************
    //end classroom selection testing
    //******************************************************************
  }

  toLogin(userRole) {
    this.navCtrl.push(UserLoginPage, {parentPage: userRole});
  }

  help(){
    let toast = this.toastCtrl.create({
      message: 'Help is on the way',
      duration: 1500,
      position: 'bottom'
    });

    toast.present(toast);
  }

  selectClassroom(){
    let alert = this.alertController.create({
      title: 'Select a Classroom'
    });
    this.classRoomService.data.forEach((value, index, map)=>{

      //pick one of the below input or button
      if(Number(index) >=0){
        alert.addInput({
              type: 'radio',
              label: 'Room ' + value.roomNumber,
              value: ''+value.roomNumber
        });
      }
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
        this.onSelectClassroom(data);
      }
    })
    alert.present();
  }


}
