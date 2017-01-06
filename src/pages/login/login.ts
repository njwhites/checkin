import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {KitchenPage} from "../kitchen/kitchen";
import {TherapistPage} from "../therapist/therapist";
import {AdminPage} from "../admin/admin";
import {StudentProvider} from "../../providers/student-provider";
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

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, 
              public classRoomService: ClassRoomProvider, public studentService: StudentProvider) {
    this.room = navParams.get('room');
    
  }
  
  ionViewDidLoad(){
    this.classRoomService.getAllClassRooms().then((data) => {
      this.classrooms = <Array<ClassRoomModel>>data;
    });
  }

  onSelectClassroom(roomNumber) {    
    
    //******************************************************************
    //testing to see if class room selection works
    //******************************************************************
    
    let roomNumberIndex = 0;
    for (let classroom of this.classrooms){
      if (classroom.roomNumber === roomNumber) break;
      roomNumberIndex++;
    }
    this.studentService.getStudentsByGroup(this.classrooms[roomNumberIndex].students).then(result =>{
      this.navCtrl.push(this.classroomPage, {roomNumber: roomNumber});
    });
    
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
      if(this.btnPage == 'kitchen') {
        this.navCtrl.push(this.kitchenPage);
      } else if(this.btnPage == 'therapist') {
        this.navCtrl.push(this.therapistPage);
      } else if(this.btnPage == 'admin') {
        this.navCtrl.push(this.adminPage);
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
}

