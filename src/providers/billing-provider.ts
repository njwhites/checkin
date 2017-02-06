import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {BillingWeekModel, StudentBillingWeek, BillingDay} from '../models/db-models';

import {ClassRoomProvider} from './class-room-provider';

/*
  Generated class for the BillingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BillingProvider {

  constructor(public http: Http, public classroomService: ClassRoomProvider) {
    console.log('Hello BillingProvider Provider');
  }


  writeBillingWeek(start_date: Date, room_number: String){
	 //these are metadata
	const billing_week = new BillingWeekModel();
	billing_week.start_date = start_date;
	billing_week.room_number = room_number;

	//this is the data
	this.classroomService.data.get(room_number).students.forEach((id) => {
		const student_billing_week = new StudentBillingWeek();
		student_billing_week.student_id = id;
		for(var i = 0; i < 5; i++){
			const billing_day = new BillingDay();
			billing_day.date = new Date(start_date.getTime() + (i * 1000 * 60 * 60 * 24));
			//Checkin provider gets to write;
		}
	})

	//These are based on the data in days


  }

  getBillingWeek(){

  }

}
