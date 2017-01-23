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
import {ClassRoomModel} from "../../models/db-models";

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
              public checkinService: CheckinProvider, public alertController: AlertController) {
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
      this.classRoomService.getAllClassRooms().then((data) =>{
        this.classrooms = <Array<ClassRoomModel>>data;
      });
    })
    loader.present();

  }

  ionViewDidLoad(){

    // this.classRoomService.getAllClassRooms().then((data) => {
    //   this.classrooms = <Array<ClassRoomModel>>data;
    // });
  }

  onSelectClassroom(roomNumber) {

    //******************************************************************
    //testing to see if class room selection works
    //******************************************************************
    if(roomNumber){
      let roomNumberIndex = 0;
      for (let classroom of this.classrooms){
        if (classroom.roomNumber === roomNumber) break;
        roomNumberIndex++;
      }
      this.userService.getAllUsers().then(output =>{
        this.studentService.getStudentsByGroup(this.classrooms[roomNumberIndex].students).then(result =>{
          this.navCtrl.push(this.classroomPage, {roomNumber: roomNumber});
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
    this.btnPage = userRole;
    document.getElementById('buttonGrid').style.display = 'none';
    document.getElementById('enterID').style.display = 'block';
  }

  onNotify(idCheck:number):void {
    if(idCheck >= 0) {
      if(this.btnPage === 'kitchen') {
        this.studentService.getStudents().then(()=>{
          this.navCtrl.push(this.kitchenPage);
        });
      } else if(this.btnPage == 'therapist') {
        this.navCtrl.push(this.therapistPage);
      } else if(this.btnPage == 'admin') {
        this.studentService.getStudents().then(()=>{
          this.userService.getAllUsers().then(()=>{
            this.navCtrl.push(this.adminPage);
          });
        });
      }
    } else {
      let toast = this.toastCtrl.create({
        message: 'Invalid ID',
        duration: 1500,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

  revert(){
    document.getElementById('enterID').style.display = 'none';
    document.getElementById('buttonGrid').style.display = 'flex';
    this.btnPage = '';
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
    this.classrooms.forEach((value, index, array)=>{
      alert.addButton({
        text: value.roomNumber,
        handler: ()=>{
          this.onSelectClassroom(value.roomNumber);
        }
      })
    });
    alert.addButton({
      text: "Cancel",
      role: "cancel",
      handler: ()=>{

      }
    })
    alert.present();
  }


}
