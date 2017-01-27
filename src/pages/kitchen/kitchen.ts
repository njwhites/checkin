import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import { ClassRoomProvider } from '../../providers/class-room-provider'
import { StudentProvider } from '../../providers/student-provider'

import { ClassRoomModel } from '../../models/db-models';

import { CheckinProvider } from '../../providers/checkin-provider'

@Component({
  selector: 'page-kitchen',
  templateUrl: 'kitchen.html'
})
export class KitchenPage {

  allClassrooms: Array<ClassRoomModel> = [];
  roomMap : any;
  refresh: any;

  constructor(public navCtrl: NavController, public classroomService: ClassRoomProvider, public studentService: StudentProvider, public checkinService: CheckinProvider) {
  	classroomService.getAllClassRooms()
  		.then((result: Array<ClassRoomModel>) => {
        this.allClassrooms = result;
        this.setRoomMap();
  		});
  }

  setRoomMap(){
    let map = [];
    this.allClassrooms.forEach((classroom: ClassRoomModel) =>{
      if(classroom.roomNumber.toLowerCase() !== 'unallocated'){
        console.log(classroom.roomNumber);
          if(classroom.roomNumber === "101"){
             console.log(this.studentService.data);
           }
        let hereStudents = classroom.students.filter(id => {      
           if(classroom.roomNumber === "101"){
             console.log(this.studentService.data.get(id).location);
           }
          return this.studentService.data.get(id).location !== this.checkinService.CHECKED_OUT;
        });
        let diet = hereStudents.filter(id => {
          return this.studentService.data.get(id).dietNeed !== undefined && this.studentService.data.get(id).dietNeed === true;
        })
        console.log(hereStudents);
        console.log(`Normies: ${hereStudents.length - diet.length} Others: ${diet.length}`);
        map.push({key: classroom.roomNumber, val: [hereStudents.length, diet. length]});  
      }
    });
    console.log(map);
    this.roomMap = map;
  }

  ionViewDidEnter(){
    if(this.refresh){
      clearInterval(this.refresh);
    }
    this.refresh = setInterval(() => {
      console.log("Refreshing");
      this.studentService.getStudents().then(() => {
        this.setRoomMap();
      })
    }, 15000)
  }

  ionViewDidLeave(){
    clearInterval(this.refresh);
  }
}
