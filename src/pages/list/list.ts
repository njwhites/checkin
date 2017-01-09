import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {StudentModel} from '../../models/db-models';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedStudent: any;
  signoutStudents: Array<string> = new Array<string>();
  @Input() parentPage: string;
  @Input() userID: number;
  @Input() roomNumber: string;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams, public checkinService: CheckinProvider) {
    this.selectedStudent = navParams.get('student');
  }

  ionViewDidLoad(){
  }

  revert(studentID:string):void {
    if((this.parentPage !== 'signout') && (this.parentPage !== 'checkin')) {

      //////////////////////////////////////////////////////////////////////////
      //Checkout student to therapist
      //////////////////////////////////////////////////////////////////////////
      if(this.parentPage === 'therapy') {
        this.checkinService.therapistCheckout(studentID, String(this.userID));
      } else if(this.parentPage === 'nurse') {
        this.checkinService.nurseCheckout(studentID, String(this.userID));
      }
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
    var studentID;
    for(studentID in this.signoutStudents) {
      this.checkinService.checkoutStudent(studentID, String(this.userID));
    }
    this.removedStudents.emit(this.signoutStudents);
  }

  //TODO: use the array of studentIDs, this.signoutStudents to checkin students inside this function
  addStudents() {
    var studentID;
    for(studentID in this.signoutStudents) {
      this.checkinService.checkinStudent(studentID, String(this.userID));
    }
    this.removedStudents.emit(this.signoutStudents);
  }

  updateNap(students:StudentProvider) {
    console.log(students.data);
  }

}
