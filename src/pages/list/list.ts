import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedStudent: any;
  emptyList: boolean;
  signoutStudents: Array<string> = new Array<string>();
  napStudents: Map<string, string> = new Map<string, string>();
  @Input() parentPage: string;
  @Input() userID: number;
  @Input() roomNumber: string;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>()

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams, public checkinService: CheckinProvider) {
    this.selectedStudent = navParams.get('student');
    this.emptyList = true;
  }

  ionViewDidLoad(){
  }

  revert(studentID:string):void {
    var search;
    if((this.parentPage !== 'signout') && (this.parentPage !== 'checkin')) {
      var returnedStudent;
      if(this.parentPage === 'therapy') {
        search = studentID.search(' returned');
        if(search === -1) {
          //////////////////////////////////////////////////////////////////////
          //Checkout student to therapist
          //////////////////////////////////////////////////////////////////////
          this.checkinService.therapistCheckout(studentID, String(this.userID));
        } else {
          //////////////////////////////////////////////////////////////////////
          //Checkin student to classroom from therapist
          //////////////////////////////////////////////////////////////////////
          returnedStudent = studentID.slice(0, search);
          this.checkinService.therapistCheckin(String(returnedStudent), String(this.userID));
        }
      } else if(this.parentPage === 'nurse') {
        search = studentID.search(' returned');
        if(search === -1) {
          ////////////////////////////////////////////////////////////////////////
          //Checkout student to nurse
          ////////////////////////////////////////////////////////////////////////
          this.checkinService.nurseCheckout(studentID, String(this.userID));
        } else {
          //////////////////////////////////////////////////////////////////////
          //Checkin student to classroom from nurse
          //////////////////////////////////////////////////////////////////////
          returnedStudent = studentID.slice(0, search);
          this.checkinService.nurseCheckin(String(returnedStudent), String(this.userID));
        }
      }
      this.listCheckedOut.emit(studentID);
    } else {
      search = studentID.search(' was removed');
      if(search === -1) {
        this.signoutStudents.push(studentID);
      } else {
        var deselectedStudentID = studentID.slice(0, search);
        var index = this.signoutStudents.indexOf(deselectedStudentID);
        if(index !== -1) {
          this.signoutStudents.splice(index, 1);
        }
      }

    }
  }

  removeStudents() {
    this.checkinService.checkoutStudents(this.signoutStudents, String(this.userID));
    this.removedStudents.emit(this.signoutStudents);
    this.signoutStudents.length = 0;
  }

  addStudents() {
    this.checkinService.checkinStudents(this.signoutStudents, String(this.userID));
    this.removedStudents.emit(this.signoutStudents);
    this.signoutStudents.length = 0;
  }

  updateNap(napTime, studentId) {
    this.napStudents.set(String(studentId), napTime);
  }

  updateAll(){
    this.studentService.data.forEach(student => {
      if(!this.napStudents.has(String(student._id))){
        this.napStudents.set(String(student._id), "60");
      }
    })

    this.checkinService.setNaps(this.napStudents);
    console.log(this.napStudents);
  }

  undo(){
    this.userID = null;
    this.signoutStudents.length = 0;
    if (this.parentPage === ('checkin' || 'signout')) {
      this.signoutStudents.push("back");
      this.removedStudents.emit(this.signoutStudents);
    } else {
      this.selectedStudent = '';
      this.listCheckedOut.emit("back");
    }
  }

  //TODO: if students are checked in after page is loaded then error is thrown
  itemInserted() {
    this.emptyList = false;
  }

}
