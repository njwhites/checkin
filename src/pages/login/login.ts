import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {KitchenPage} from "../kitchen/kitchen";
import {TherapistPage} from "../therapist/therapist";
import {AdminPage} from "../admin/admin";
import {StudentProvider} from "../../providers/student-provider";


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
  classrooms: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, 
              public classRoomService: ClassRoomProvider, public studentService: StudentProvider) {
    this.room = navParams.get('room');
    
  }
  
  ionViewDidLoad(){
    this.classRoomService.getAllClassRooms().then((data) => {
      this.classrooms = data;
    });
  }

  onSelectClassroom(roomNumber) {    
    
    //******************************************************************
    //testing to see if class room selection works
    //******************************************************************
    
    this.classRoomService.getClassRoomByRoomNumber(String(roomNumber)).then((result: any) =>{
      if(result){
        this.studentService.getStudentsByGroup(result.students).then(result =>{
          this.navCtrl.push(this.classroomPage, {roomNumber: roomNumber});
        });
      } else {
        //**************** TODO **********
        //put something in here to alert the user that that classroom doesn't exist
        //**************** TODO **********
        
        alert("invalid room number");
        console.log("invalid room number");
      }
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

