import {Component} from "@angular/core";
import {NavController, ToastController, NavParams} from "ionic-angular";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {ClassRoomModel} from "../../models/db-models";


@Component({
  selector: 'page-classroom-add-modal',
  templateUrl: 'classroom-add-modal.html'
})
export class ClassroomAddModalPage {

  classrooms: Array<ClassRoomModel>;
  students: Array<string>;
  classroom: ClassRoomModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public classRoomService: ClassRoomProvider,
              public studentService: StudentProvider,
              public toastCtrl: ToastController) {
    this.classRoomService.getAllClassRooms().then((data) =>{
      this.classrooms = <Array<ClassRoomModel>>data;
    });
    this.classroom = navParams.get('currentroom');
    console.log(this.classroom);
    this.students = <Array<string>>this.classroom.students;
  }

  ionViewDidLoad() {}

  toggleDropDown(id) {
    let dividerId = "classroom_" + id;
    let buttonUpId = "upButton_" + id;
    let buttonDownId = "downButton_" + id;
    if (!document.getElementById(dividerId).hidden){
      document.getElementById(dividerId).hidden = true;
      document.getElementById(buttonUpId).hidden = true;
      document.getElementById(buttonDownId).hidden = false;
    } else {
      document.getElementById(dividerId).hidden = false;
      document.getElementById(buttonUpId).hidden = false;
      document.getElementById(buttonDownId).hidden = true;
    }
  }

  addToClass(SID) {
    //for tracking and maybe user feedback purposes
    //save the previous room for future display
    let previousRoom: ClassRoomModel;

    //first we want to get the student from the previous room and remove them
    this.classRoomService.getAllClassRooms().then((classrooms:Array<ClassRoomModel>)=>{
      previousRoom = classrooms.find((value)=>{return value.students.indexOf(SID) >= 0});

      this.classRoomService.removeStudentFromClass(previousRoom, SID);
    });

    //now we add the student to the current room
    this.classRoomService.addStudentToClass(this.classroom, SID);


    document.getElementById("student_" + SID).hidden = true;
    let toast = this.toastCtrl.create({
      message: this.studentService.data.get(SID).fName.toString() + " " + this.studentService.data.get(SID).lName.toString() + " added to classroom " + this.classroom.roomNumber,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  isClassroomSubsetOfThis(classroom): boolean{
    return classroom.students.every((value)=>{return this.students.indexOf(value) >= 0})
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
