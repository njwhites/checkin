import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedStudent: any;
  students: Array<{title: string, note: string, icon: string}>;
  signoutStudents: Array<string> = new Array<string>();
  @Input() parentPage: string;
  @Input() userID: number;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');

    this.students = [];
    this.students.push({
      title: 'Matthew',
      note: 'checked in at 8:15am',
      icon: 'man'
    });
    this.students.push({
      title: 'Mark',
      note: 'checked in at 8:05am',
      icon: 'man'
    });
    this.students.push({
      title: 'Sarah',
      note: 'checked in at 8:05am',
      icon: 'woman'
    });
    this.students.push({
      title: 'Laurel',
      note: 'checked in at 7:55am',
      icon: 'woman'
    });
    this.students.push({
      title: 'Luke',
      note: 'checked in at 8:10am',
      icon: 'man'
    });
    this.students.push({
      title: 'Katie',
      note: 'checked in at 8:00am',
      icon: 'woman'
    });
  }

  revert(studentName:string):void {
    if(this.parentPage !== 'signout') {
      this.listCheckedOut.emit(studentName);
    } else {
      this.signoutStudents.push(studentName);
      console.log("adding to List: " + this.signoutStudents.length);
    }
  }

  removeStudents() {
    this.removedStudents.emit(this.signoutStudents);
  }
}
