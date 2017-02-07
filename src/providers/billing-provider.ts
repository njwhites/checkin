import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {BillingWeekModel, StudentBillingWeek, BillingDay, 
	TransactionEvent, TransactionStudentModel, TransactionTherapy, ClassroomWeek} from '../models/db-models';

import {ClassRoomProvider} from './class-room-provider';
import {CheckinProvider} from './checkin-provider';
import {UserProvider} from './user-provider';


import PouchDB from 'pouchdb';

/*
  Generated class for the BillingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BillingProvider {


  db: any;
  remote: any;


  constructor(public http: Http, public classroomService: ClassRoomProvider, public checkinService: CheckinProvider, public userService: UserProvider) {
    console.log('Hello BillingProvider Provider');


    this.db = new PouchDB('transactions');

    PouchDB.plugin(require('pouchdb-upsert'));

    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/billing';
    //this.remote = 'http://localhost:5984/classrooms';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  getClassroomBilling(room_number: String){
  	return new Promise((resolve, reject) => {
		this.db.allDocs({include_docs: true}).then(result => {

	        //get today's object, if it does not exist, create it
	  	    let trans = result.rows.filter((row) => {
	  	    	return row.doc._id === room_number;
	  	    });

	        //Day already exists in the db
	  	    if(trans.length > 0){
				let room = new ClassroomWeek();
				room.room_number = trans[0]._id;
				room.weeks = trans.billingWeeks;
				resolve(room);
	  	    }else{
	          //Day did not exist, creates and puts it
	          this.db.upsert(room_number, (doc) => {
	            return {
	              _id: room_number,
	              billingWeeks: []
	            }
	          }).then(response => {
	            //unsure how to do this without recursion. basically since it has been added to the db,
	            //it will on recursion go into the other part of the if/else
	            console.log("Successfully added billing document for room: " + room_number)
	            resolve(this.getClassroomBilling(room_number));
	          }).catch(function (err) {
	            console.log(err);
	          });
	  	    }
     	}).catch(err =>{
        	console.log(err)
    	});
  	});
  }


  writeBillingWeek(start_date: Date, room_number: String){
	 //these are metadata

	//this is the data
	var ids = this.classroomService.data.get(room_number).students;

	this.writeBillingWeekHelper(ids, start_date, []).then((billing_week: BillingWeekModel) => {
		billing_week.room_number = room_number;
		//upsert
		var dateString = `${room_number}`;
		this.getClassroomBilling(room_number).then((doc: ClassroomWeek) => {
			let others = doc.weeks.filter((week: BillingWeekModel) => {
				return start_date.getDate() === week.start_date.getDate() &&
					start_date.getMonth() === week.start_date.getMonth() &&
					start_date.getFullYear() === week.start_date.getFullYear();
			});
			let me = {
				start_date: billing_week.start_date,
				room_number: billing_week.room_number,

				students: billing_week.students.map((each:StudentBillingWeek) => {
					return {
						student_id: each.student_id,
						average_hours_billed_per_day: each.average_hours_billed_per_day,

						billing_days: each.student_days.map((day:BillingDay) => {
							return {
								date: day.date,
								start_time: day.start_time,
								end_time: day.end_time,

								nap_hours: day.nap_hours,
								SP_therapy_hours: day.SP_therapy_hours,
								OT_therapy_hours: day.OT_therapy_hours,
								PT_therapy_hours: day.PT_therapy_hours,

								net_hours: day.net_hours,
								billable_hours: day.billable_hours
							}
						})
					}
				}),

				billing_percent: billing_week.billing_percent

			}
			this.db.upsert(doc.room_number, (document) => {
				document.weeks = [...document.weeks, me]
				return document;
			}).then(response => {
				//unsure how to do this without recursion. basically since it has been added to the db,
				//it will on recursion go into the other part of the if/else
				console.log("Successfully added transaction for day: " + dateString)
				//resolve();
			}).catch(function (err) {
				console.log(err);
			});
		})

		console.log(billing_week);
	})


  }

  writeBillingWeekHelper(ids: Array<String>, start_date: Date, data: Array<StudentBillingWeek>){
  	if(ids.length <= 0){
  		return new Promise(resolve => {
			const billing_week = new BillingWeekModel();
			billing_week.students = data;
			billing_week.start_date = start_date;

			//percent or something
			var count = 0;
			var hours = 0;
			billing_week.students.forEach(student => {
				count++;
				hours += student.average_hours_billed_per_day;
			});

			billing_week.billing_percent = (hours / count / 5) * 100;

			resolve(billing_week);
  		});
  	}

  	var currentID = ids.splice(0,1);

  	this.createBillingWeek(String(currentID[0]), start_date).then((sbw:StudentBillingWeek) => {
  		data.push(sbw);
  		this.writeBillingWeekHelper(ids, start_date, data);
  	})
  }


  createBillingWeek(s_id: string, start_date:Date){
    var array = [];
    for(var i = 0; i < 5; i++){
      array.push(new Date(start_date.getTime() + (i * 1000 * 60 * 60 * 24)));
    }
    return this.createBillingWeekHelper(s_id, array, []);
  }

  createBillingWeekHelper(s_id: string, dates: Array<Date>, data: Array<BillingDay>){
    if(dates.length <= 0){
      return new Promise(resolve => {
        var week = new StudentBillingWeek();
        week.student_days = data;
        week.student_id = s_id;

        //calculate avg billed hours
        var count = 0;
        var totalBilled = 0;
        data.forEach(day => {
          //if(day.billable_hours > 0){
            count++;
            totalBilled += day.billable_hours;
          //}
        })
        week.average_hours_billed_per_day = totalBilled/count;
        
        resolve(week);
      });
    }

    var currentDate = dates.splice(0,1);
    this.createBillingDay(s_id, currentDate[0]).then((billingDay: BillingDay) => {
      data.push(billingDay);
      this.createBillingWeekHelper(s_id, dates, data);
    })

  }

  createBillingDay(s_id:string, date:Date){
    return new Promise((resolve, reject) => {
      const day = new BillingDay();
      const dateString = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
      this.checkinService.getTodaysTransaction(dateString).then(doc => {
        this.checkinService.getStudent(s_id, doc).then((student:TransactionStudentModel) => {
          day.nap_hours = Number(student.nap);
          //event info
          student.events.forEach((event:TransactionEvent) => {
            if(day.start_time < 0 && event.type === this.checkinService.CHECK_IN){
              day.start_time = Number(event.time);
            }
            if(day.end_time < 0 && event.type === this.checkinService.CHECK_OUT){
              day.end_time = Number(event.time);
            }
          });

          if(day.start_time >= 0 && day.end_time >= 0){
            day.gross_hours = (day.end_time - day.start_time) / (1000 * 60 * 60);
          }

          //therapy info
          var totalTherapy = 0;
          student.therapies.forEach((therapy:TransactionTherapy) => {
            var type = this.userService.data.get(therapy.by_id).therapy_type;
            var therapyLength = therapy.length.valueOf();
            if(type === 'PT'){
              day.PT_therapy_hours += therapyLength;
              totalTherapy += therapyLength;
            }else if(type === 'OT'){
              day.OT_therapy_hours += therapyLength;   
              totalTherapy += therapyLength;   
            }else{
              day.SP_therapy_hours += therapyLength;
              totalTherapy += therapyLength;
            }
          })

          //net hours = gross - nap - therapy
          if(day.gross_hours < 0){
            day.net_hours = day.gross_hours - day.nap_hours - totalTherapy;
          }

          //billable = min(net, 5).truncate
          if(day.net_hours > 0){
            day.billable_hours = Math.floor(Math.min(day.net_hours, 5));
          }
          resolve(day);
        })
      })

    })

  }
}
