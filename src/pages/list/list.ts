import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController, ToastController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {UserProvider} from '../../providers/user-provider';
import {StudentDetailsPage} from '../student-details/student-details';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  toastTrigger: boolean;
  studentID: string;
  selectedStudent: any;
  signoutStudents: Array<string> = new Array<string>();
  napStudents: Map<string, string> = new Map<string, string>();
  @Input() parentPage: string;
  @Input() userID: string;
  @Input() roomNumber: string;
  @Output() listCheckedOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() removedStudents: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  timeSinceLastInteraction: number = 0;
  interval: any;

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public checkinService: CheckinProvider, public userService: UserProvider) {
    this.selectedStudent = navParams.get('student');
    this.parentPage = navParams.get('parentPage');
    this.userID = navParams.get('userID');
    this.roomNumber = navParams.get('roomNumber');
    this.studentID = '';
    this.toastTrigger = false;
  }

  resetInterval () {
    this.timeSinceLastInteraction = 0;
  }


  ionViewDidEnter(){
    console.log("the list page has been made the focus with a parent page of "+ this.parentPage);
    console.log("the user id is: " + this.userID);
    console.log("the room number is " + this.roomNumber);
  }

  revert(studentID:string):void {
    var search;
    if((this.parentPage !== 'signout') && (this.parentPage !== 'checkin')) {
      this.studentID = studentID;
      var returnedStudent;
      if(this.parentPage === 'therapy') {
        search = studentID.search(' returned');
        if(search === -1) {
          //////////////////////////////////////////////////////////////////////
          //Checkout student to therapist
          //////////////////////////////////////////////////////////////////////
          console.log(this.userID);
          this.userService.getTherapistTypeByID(this.userID).then((type:string) => {
            this.checkinService.therapistCheckout(studentID, String(this.userID), type);
          }).catch(err => {
            this.checkinService.therapistCheckout(studentID, String(this.userID), "");
          });
          this.studentID = studentID;
          this.navCtrl.pop();

        } else {
          //////////////////////////////////////////////////////////////////////
          //Checkin student to classroom from therapist
          //////////////////////////////////////////////////////////////////////
          returnedStudent = studentID.slice(0, search);
          this.checkinService.therapistCheckin(String(returnedStudent), String(this.userID));
          this.navCtrl.pop();
        }
      } else if(this.parentPage === 'nurse') {
        search = studentID.search(' returned');
        if(search === -1) {
          ////////////////////////////////////////////////////////////////////////
          //Checkout student to nurse
          ////////////////////////////////////////////////////////////////////////
          this.checkinService.nurseCheckout(studentID, String(this.userID));
          this.navCtrl.pop();
        } else {
          //////////////////////////////////////////////////////////////////////
          //Checkin student to classroom from nurse
          //////////////////////////////////////////////////////////////////////
          returnedStudent = studentID.slice(0, search);
          this.checkinService.nurseCheckin(String(returnedStudent), String(this.userID));
          this.navCtrl.pop();
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
    this.toastTrigger = true;
    this.navCtrl.pop();
  }

  addStudents() {
    this.checkinService.checkinStudents(this.signoutStudents, String(this.userID));
    this.removedStudents.emit(this.signoutStudents);
    this.toastTrigger = true;
    this.navCtrl.pop();
  }

  updateNap(napTime, studentId) {
    this.napStudents.set(String(studentId), napTime);
  }

  updateAll(){
    this.studentService.data.forEach(student => {
      if(!this.napStudents.has(String(student._id)) && (student.location !== 'Checked out')){
        this.napStudents.set(String(student._id), "60");
      }
    })

    this.checkinService.setNaps(this.napStudents);
    let toast = this.toastCtrl.create({
      //message: this.napStudents.length + ' student(s) checked in!',
      message: "Naps Updated",
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
    console.log(this.napStudents);
  }

  undo(){
    this.userID = null;
    this.signoutStudents.length = 0;
    if (this.parentPage === 'checkin' || this.parentPage === 'signout') {
      this.signoutStudents.push("back");
      this.removedStudents.emit(this.signoutStudents);
    } else {
      this.selectedStudent = '';
      this.listCheckedOut.emit("back");
    }
  }

  //TODO: if students are checked in after page is loaded then error is thrown
  isListEmpty() {
    let isEmpty: boolean;
    isEmpty = true;
    if (this.parentPage === 'signout' || this.parentPage === 'napStudents') {
      this.studentService.data.forEach(student => {
        if(student.location !== 'Checked out'){
          isEmpty = false;
        }
      });
    }
    if(this.parentPage === 'checkin') {
      this.studentService.data.forEach(student => {
        if(student.location === 'Checked out'){
          isEmpty = false;
        }
      });
    }
    if(this.parentPage === 'therapy') {
      this.studentService.data.forEach(student => {
        if(student.location === 'Therapist checked student out'){
          isEmpty = false;
        }else if(student.location !== 'Checked out' && student.location !==  'Therapist checked student out' && student.location !==  'Nurse checked student out'){
          isEmpty = false;
        }
      });
    }
    if(this.parentPage === 'nurse') {
      this.studentService.data.forEach(student => {
        if(student.location === 'Nurse checked student out'){
          isEmpty = false;
        }else if(student.location !== 'Checked out' && student.location !==  'Therapist checked student out' && student.location !==  'Nurse checked student out'){
          isEmpty = false;
        }
      });
    }
    return isEmpty;
  }

  studentTapped(event, student) {
    clearInterval(this.interval);
    this.navCtrl.push(StudentDetailsPage, {
      student: student
    })
  }

  ionViewWillEnter(){
    this.timeSinceLastInteraction = 0;
    this.interval = setInterval(() => {
      if(++this.timeSinceLastInteraction >= 30){
        clearInterval(this.interval);
        // switch back from this page, nuke it, kill it with fire
        this.navCtrl.popToRoot();
      }
    }, 1000)
  }

  ionViewWillLeave() {
    this.timeSinceLastInteraction = 25;

    var output = '';
    switch(this.parentPage) {
      case 'checkin':
        output = this.signoutStudents.length !== 0 && this.toastTrigger === true ? this.signoutStudents.length + ' student(s) have been checked in' : '';
        this.signoutStudents.length = 0;
        break;
      case 'signout':
        output = this.signoutStudents.length !== 0 && this.toastTrigger === true ? this.signoutStudents.length + ' student(s) have been checked out' : '';
        this.signoutStudents.length = 0;
        break;
      case 'therapy':
        if (this.studentID !== '') {
          if(this.studentID.search(' returned') === -1) {
            output = this.studentService.data.get(this.studentID).fName.toString() + ' is off to therapy';
          }
          else {
            output = this.studentService.data.get(this.studentID.slice(0, this.studentID.search(' returned'))).fName.toString() + ' has returned from therapy';
          }
        }
        break;
      case 'nurse':
        if (this.studentID !== '') {
          if(this.studentID.search(' returned') === -1) {
            output = this.studentService.data.get(this.studentID).fName.toString() + ' is off to the nurse';
          }
          else {
            output = this.studentService.data.get(this.studentID.slice(0, this.studentID.search(' returned'))).fName.toString() + ' has returned from the nurse';
          }
        }
        break;
      default:
        break;
    }
    if(output !== '') {
      let toast = this.toastCtrl.create({
        message: output,
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

}
