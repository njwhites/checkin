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

  constructor(public navCtrl: NavController, public classroomService: ClassRoomProvider, public studentService: StudentProvider, public checkinService: CheckinProvider) {
  	classroomService.getAllClassRooms()
  		.then((result: Array<ClassRoomModel>) => {
  			result.forEach((classroom: ClassRoomModel) =>{
  				console.log(classroom.roomNumber);
  				let hereStudents = classroom.students.filter(id => {					
  					return studentService.data.get(id).location !== checkinService.CHECKED_OUT;
  				});
  				let diet = hereStudents.filter(id => {
  					return studentService.data.get(id).dietNeed !== undefined && studentService.data.get(id).dietNeed === true;
  				})
  				console.log(hereStudents);
  				console.log(`Normies: ${hereStudents.length - diet.length} Others: ${diet.length}`);
  			});
  		});
  }

}
