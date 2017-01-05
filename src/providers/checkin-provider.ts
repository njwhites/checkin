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

  checkInStudent(id: string, doc: any, by_id: string){
  	let me = doc.students.filter(student => {
  		return student.id + "" === id + "";
  	});
    //If the student has not interacted yet with checkin today
  	if(me.length < 1){	
	  	this.db.put({
	  		_id: doc._id,
	  		_rev: doc._rev,
	  		date: doc.date,
	  		students: [...doc.students, {id:id, events: [{checkin: Date.now(), by_id: by_id}]}]
	  	})
  	}else{
  		let others = doc.students.filter(student => {
  			return student.id + "" !== id + "";
  		})
  		me[0].events.push({checkin: Date.now(), by_id: by_id});
  		this.db.put({
	  		_id: doc._id,
	  		_rev: doc._rev,
	  		date: doc.date,
	  		students: [...others, me[0]]
	  	})
  	}
  	console.log(doc);
  }

  checkinStudent(id: string, by_id: string){
  	let today = new Date();
  	let dateString = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

  	this.getTodaysTransaction(dateString).then(result => {
  		this.checkInStudent(id, result, by_id);
  	});

  }

}
