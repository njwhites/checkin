import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";
import {ClassroomPage} from "../classroom/classroom";

@Component({
  selector: 'page-classroom-selection-modal',
  templateUrl: 'classroom-selection-modal.html'
})
export class ClassroomSelectionModalPage {
  classroomPage = ClassroomPage;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, public classRoomService: ClassRoomProvider, public userService: UserProvider, public studentService: StudentProvider,) {

  }

  submit(id) {
    if(id){
      this.classRoomService.selectedClassroom = id;
      this.userService.getAllUsers().then(output =>{
        this.studentService.getStudentsByGroup(this.classRoomService.data.get(id).students).then(result =>{
          this.navCtrl.push(this.classroomPage, {roomNumber: this.classRoomService.data.get(id).roomNumber});
          this.viewCtrl.dismiss();
        });
      });
    } else{
      console.log("Error");
    }
  }

  }
