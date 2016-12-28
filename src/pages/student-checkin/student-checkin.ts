//-----------------------------------------
// This is no longer used I think -Chris 12/28/2016
//
//-----------------------------------------



import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {StudentCheckinConfirmPage} from "../student-checkin-confirm/student-checkin-confirm";
import {StudentProvider} from '../../providers/student-provider';

@Component({
  selector: 'page-student-checkin',
  templateUrl: 'student-checkin.html',
})
export class StudentCheckinPage {
  students: any;
  room: any;

  constructor(public studentService: StudentProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.room = navParams.get('room');
    // If we navigated to this page, we will have an item available as a nav param

    //this.checkedStudents = [];
    this.students = [];
    
    /*this.students.push({
      id: 111,
      title: 'Matthew',
      note: 'checked in at 8:15am',
      icon: 'man',
      selected: false
    });
    this.students.push({
      id: 112,
      title: 'Mark',
      note: 'checked in at 8:05am',
      icon: 'man',
      selected: false,
    });
    this.students.push({
      id: 213,
      title: 'Sarah',
      note: 'checked in at 8:05am',
      icon: 'woman',
      selected: false
    });
    this.students.push({
      id: 324,
      title: 'Laurel',
      note: 'checked in at 7:55am',
      icon: 'woman',
      selected: false
    });
    this.students.push({
      id: 543,
      title: 'Luke',
      note: 'checked in at 8:10am',
      icon: 'man',
      selected: false
    });
    this.students.push({
      id: 612,
      title: 'Katie',
      note: 'checked in at 8:00am',
      icon: 'woman',
      selected: false
    });
    this.students.sort((a, b) => {
      return a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1;
    })*/
  }

  ionViewDidLoad() {
    console.log('Hello StudentCheckinPage Page');
    
    this.studentService.getStudents().then(data => {
      this.students = data;
    });
    console.log(this.students);
  }

  studentTapped(event, student) {
    student.selected = !student.selected;
  }

  checkIn(event){
    let checkedStudents = this.students
      .filter((student) => {return student.selected})
      .map((student) => {
        return {
          id: student.id,
          name: student.title
        };
      });
    this.navCtrl.push(StudentCheckinConfirmPage, {students: checkedStudents, room: this.room});

  }
}
