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

  revert(studentName:string):void {
    if((this.parentPage !== 'signout') && (this.parentPage !== 'checkin')) {
      this.listCheckedOut.emit(studentName);
    } else {
      this.signoutStudents.push(studentName);
      console.log("adding to List: " + this.signoutStudents.length);
    }
  }

  removeStudents() {
    this.removedStudents.emit(this.signoutStudents);
    // console.log(this.userID);       this proves that the ID passes
    // console.log(this.roomNumber);   this proves that the ID passes
  }

  addStudents() {
    this.removedStudents.emit(this.signoutStudents);
    // console.log(this.userID);       this proves that the ID passes
    // console.log(this.roomNumber);   this proves that the ID passes
  }

}
