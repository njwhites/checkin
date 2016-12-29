import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ClassroomPage} from "../classroom/classroom";
import {ClassRoomProvider} from "../../providers/class-room-provider";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  classroomPage = ClassroomPage;
  room: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, 
              public classRoomService: ClassRoomProvider) {
    this.room = navParams.get('room');
  }

  onSelectClassroom(roomNumber) {
    console.log(roomNumber);
    
    //******************************************************************
    //testing to see if class room selection works
    //******************************************************************
    
    let classroom: any;
    this.classRoomService.getClassRoomByRoomNumber(String(roomNumber)).then((result: any) =>{
      if(result){
        console.log(result.students);
        
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
    
    //TODO: here is where we will pass the params of the room number in.
    this.navCtrl.push(this.classroomPage);
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
