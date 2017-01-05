import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import PouchDB from 'pouchdb';

/*
  Generated class for the CheckinProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CheckinProvider {

  CHECK_IN = 'checkin';
  CHECK_OUT = 'checkout';
  NURSE_IN = 'checkinByNurse';
  NURSE_OUT = 'checkoutByNurse';
  THERAPY_IN = 'checkinByTherapist';
  THERAPY_OUT = 'checkoutByTherapist';
  db: any;
  remote: any;

  constructor(public http: Http) {
    console.log('Hello CheckinProvider Provider');

    this.db = new PouchDB('transactions');
    
    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/transactions';
    //this.remote = 'http://localhost:5984/classrooms';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    this.db.sync(this.remote, options);
  }

  getTodaysTransaction(dateString: string){
    //if not supplied, set to today. format is d.m.y
    if(dateString === null){
      let today = new Date();
      dateString = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;      
    }

  	return new Promise((resolve) => {
  		this.db.allDocs({include_docs: true}).then(result => {

      //get today's object, if it does not exist, create it
	    let trans = result.rows.filter((row) => {
	    	return row.doc.date === dateString;
	    });

      //Day already exists in the db
	    if(trans.length > 0){
	    	resolve(trans[0].doc);
	    }else{
        //Day did not exist, creates and puts it
        this.db.put({
          _id: dateString,
          date: dateString,
          students: []
        }).then(response => {
          //unsure how to do this without recursion. basically since it has been added to the db, 
          //it will on recursion go into the other part of the if/else
          return this.getTodaysTransaction(dateString);
        }).catch(function (err) {
          console.log(err);
        });
	    }
     	}).catch(err =>{
        	console.log(err)
    	});
  	})
  }
  getStudent(id: string, doc: any){
    let me = doc.students.filter(student => {
      return student.id + "" === id + "";
    });
    //if the student searched for doesnt already exist
    if(me.length < 1){  
      this.db.put({
        _id: doc._id,
        _rev: doc._rev,
        date: doc.date,
        students: [...doc.students, {id:id, events: []}]
      }).then(response => {
        //similar recursion to in getTodaysTransaction
        return this.getStudent(id, doc);
      }).catch(err => {
        console.log(err);
      })
    }else{
      return me[0];
    }
  }

  updateStudent(me, doc){
    //pushes student back to db, changed theoretically
    let others = doc.students.filter(student => {
      return student.id + "" !== me.id + "";
    })

    this.db.put({
      _id: doc._id,
      _rev: doc._rev,
      date: doc.date,
      students: [...others, me]
    })
  
  }
  performEvent(id: string, doc: any, by_id: string, event: string){

    //If the student has not interacted yet with checkin today
    let time = new Date();
    let dateReadable = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
    let me = this.getStudent(id, doc);

		me.events.push({type: event, time: time.getTime(), time_readable: dateReadable, by_id: by_id});

    this.updateStudent(me, doc);

  }

  checkinStudent(id: string, by_id: string){
  	this.getTodaysTransaction(null).then(result => {
  		this.performEvent(id, result, by_id, this.CHECK_IN);
  	});
  }

  //naps

  //checkout of school
  checkoutStudent(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.CHECK_OUT);
    });
  }

  //i/o nurse
  nurseCheckout(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.NURSE_OUT);
    });
  }

  nurseCheckin(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.NURSE_IN);
    });
  }
  //i/o therapist
  therapistCheckout(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.THERAPY_OUT);
    });
  }

  therapistCheckin(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.THERAPY_IN);
    });
  }


}
