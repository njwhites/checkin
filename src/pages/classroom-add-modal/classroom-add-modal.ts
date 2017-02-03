import {Component} from "@angular/core";
import {NavController, ToastController, NavParams} from "ionic-angular";
import {ClassRoomProvider} from "../../providers/class-room-provider";
import {StudentProvider} from "../../providers/student-provider";
import {UserProvider} from "../../providers/user-provider";
import {ClassRoomModel} from "../../models/db-models";


@Component({
  selector: 'page-classroom-add-modal',
  templateUrl: 'classroom-add-modal.html'
})
export class ClassroomAddModalPage {

  classrooms: Array<ClassRoomModel>;
  students: Array<string>;
  aides: Array<string>;
  classroom: ClassRoomModel;
  isStudentAdd: boolean;
  titleText: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public classRoomService: ClassRoomProvider,
              public studentService: StudentProvider,
              public userService: UserProvider,
              public toastCtrl: ToastController) {
    this.classroom = navParams.get('currentroom');
    this.isStudentAdd = navParams.get('isStudentAdd');
    console.log(this.classroom);
    console.log(this.isStudentAdd);
    if(this.isStudentAdd){
      this.titleText = "Add Students to Room " + this.classroom.roomNumber;
      this.classRoomService.getAllClassRooms().then((data) =>{
        this.classrooms = <Array<ClassRoomModel>>data;
      });
      this.students = <Array<string>>this.classroom.students;
    } else {
      this.titleText = "Add teaching aides to Room " + this.classroom.roomNumber;
      if(this.classroom.aides === undefined){
        this.classroom.aides = new Array<string>();
      }
      this.aides = <Array<string>>this.classroom.aides;
      console.log(this.aides);
    }
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

  addAideToClass(user) {

    //now we add the student to the current room
    this.classRoomService.addAideToClass(this.classroom, user.key);


    document.getElementById("aide_" + user.key).hidden = true;
    let toast = this.toastCtrl.create({
      message: user.val.fName.toString() + " " + user.val.lName.toString() + " added to classroom " + this.classroom.roomNumber,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  dismiss(){
    this.navCtrl.pop();
  }

}
