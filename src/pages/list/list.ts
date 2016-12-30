import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedStudent: any;
  students: any;
  signoutStudents: Array<string> = new Array<string>();
  @Input() parentPage: string;
  @Input() userID: number;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
    this.studentService.getStudents().then((data) => {
      this.students = data;
    });
    console.log("userID in list: " + this.userID);
  }
  
  ionViewDidLoad(){
    console.log("userID in list after ionViewDidLoad: " + this.userID);
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
  }

  addStudents() {
    this.removedStudents.emit(this.signoutStudents);
  }
}
