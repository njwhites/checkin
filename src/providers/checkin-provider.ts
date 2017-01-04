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
	    let trans = result.rows.filter((row) => {
	    	console.log(row.doc.date);
	    	return row.doc.date === dateString;
	    });
	    if(trans.length > 0){

	    	resolve(trans[0].doc);
	    }else{
	    	console.log("Creating today's for " + dateString);
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
  	if(me.length < 1){	
	  	this.db.put({
	  		_id: doc._id,
	  		_rev: doc._rev,
	  		date: doc.date,
	  		students: [...doc.students, {id:id, events: [{checkin: Date.now()}]}]
	  	})
  	}else{
  		let others = doc.students.filter(student => {
  			return student.id + "" !== id + "";
  		})
  		me[0].events.push({checkin: Date.now()});
  		this.db.put({
	  		_id: doc._id,
	  		_rev: doc._rev,
	  		date: doc.date,
	  		students: [...others, me[0]]
	  	})
  	}
  	console.log(doc);
  }

  checkinStudent(id: string){
  	//get today's object, if it does not exist, create it
  	let today = new Date();
  	let dateString = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
  	this.getTodaysTransaction(dateString).then(result => {
  		this.getStudent(id, result);
  	});

  }

}
