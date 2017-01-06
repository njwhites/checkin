import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedStudent: any;
  students: Array<Object>;
  signoutStudents: Array<string> = new Array<string>();
  @Input() parentPage: string;
  @Input() userID: number;
  @Input() roomNumber: string;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
    /*this.studentService.getStudents().then((data) => {
      this.students = data;
    });*/
    this.students = new Array();
    this.studentService.data.forEach((value, key, map ) =>{
      this.students.push(value);
    });

    console.log(this.students);

  }

  ionViewDidLoad(){
  }

  revert(studentID:string):void {
    if((this.parentPage !== 'signout') && (this.parentPage !== 'checkin')) {
      //////////////////////////////////////////////////////////////////////////
      //TODO: put transactions for taking student to nurse or therapist here using the studentID
      //////////////////////////////////////////////////////////////////////////
      this.listCheckedOut.emit(studentID);
    } else {
      var search = studentID.search(' was removed');
      if(search === -1) {
        this.signoutStudents.push(studentID);
        console.log("adding to List: " + this.signoutStudents.length);
      } else {
        var deselectedStudentID = studentID.slice(0, search);
        console.log(deselectedStudentID + ' is the id');
        var index = this.signoutStudents.indexOf(deselectedStudentID);
        if(index !== -1) {
          this.signoutStudents.splice(index, 1);
          console.log("removing from List: " + this.signoutStudents.length);
        }
      }

    }
  }

  //TODO: use the array of studentIDs, this.signoutStudents to checkout students inside this function
  removeStudents() {
    this.removedStudents.emit(this.signoutStudents);
  }

  //TODO: use the array of studentIDs, this.signoutStudents to checkin students inside this function
  addStudents() {
    this.removedStudents.emit(this.signoutStudents);
  }

}
