import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { StudentProvider } from './student-provider'

import { TransactionModel, TransactionStudentModel, TransactionEvent} from '../models/db-models';

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

  CHECKED_OUT = 'Checked out';
  CHECKED_IN = 'Checked in/In classroom';
  CHECKED_OUT_THERAPY = 'Therapist checked student out';
  CHECKED_OUT_NURSE = 'Nurse checked student out';

  db: any;
  remote: any;

  constructor(public http: Http, public studentService: StudentProvider) {
    console.log('Hello CheckinProvider Provider');

    this.db = new PouchDB('transactions');

    PouchDB.plugin(require('pouchdb-upsert'));

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
          let transaction = new TransactionModel();
          transaction._id = trans[0].doc._id;
          transaction._rev = trans[0].doc._rev;
          transaction.date = trans[0].doc.date;
          transaction.students = trans[0].doc.students;
  	    	resolve(transaction);
  	    }else{
          //Day did not exist, creates and puts it
          this.db.upsert(dateString, (doc) => {
            return {
              _id: dateString,
              date: dateString,
              students: []
            }
          }).then(response => {
            //unsure how to do this without recursion. basically since it has been added to the db,
            //it will on recursion go into the other part of the if/else
            console.log("Successfully added transaction for day: " + dateString)
            resolve(this.getTodaysTransaction(dateString));
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
    function addStudent(doc){
      doc.students = [...doc.students, {id:id, events: []}];
      return doc;
    }
    //if the student searched for doesnt already exist
    return new Promise(resolve => {
      let me = doc.students.filter(student => {
        return student.id + "" === id + "";
      });
      if(me.length < 1){
        this.db.upsert(doc._id, addStudent).then(response => {
          //similar recursion to in getTodaysTransaction
          //console.log(response);
          return this.getTodaysTransaction(doc._id);
          //return this.getStudent(id, doc);
        }).then(result => {
          //console.log(result);
          resolve(this.getStudent(id, result));
        }).catch(err => {
          console.log(err);
        });
      }else{
        let student = new TransactionStudentModel();
        student.id = me[0].id;
        student.events = me[0].events;
        resolve(student);
      }
    })
  }

  updateStudent(me: TransactionStudentModel, doc){
    //pushes student back to db, changed theoretically
    let others = doc.students.filter(student => {
      return student.id + "" !== me.id + "";
    })
    let i = {
        id: me.id,
        events: me.events.map(event => {
          return {
            type: event.type,
            time: event.time,
            time_readable: event.time_readable,
            by_id: event.by_id
          }
        })
    }
    //console.log(i);
    function delta(doc) {
      doc.students = [...others, i];
      //console.log(doc.students);
      return doc;
    }
    return new Promise(resolve => {
      this.db.upsert(doc._id, delta).then(() => {
        //Success!
        //console.log(`Successfully updated student with id:${me.id}`);
        resolve(true);

      }).catch(err => {
        console.log(err);
      })
    });

    // this.db.put({
    //   _id: doc._id,
    //   _rev: doc._rev,
    //   date: doc.date,
    //   students: [...others, i]
    // })

  }
  performEvent(id: string, doc: any, by_id: string, event: string){

    //If the student has not interacted yet with checkin today
    return new Promise((resolve, reject) => {
      let time = new Date();

      //console.log(doc._id)
      let mins: string;
      let am_pm = "AM";
      let hours = String(time.getHours());
      if (time.getHours() > 12){
        hours = String(time.getHours() - 12);
        am_pm = "PM";
      }
      if (time.getMinutes() < 10){
        mins = "0" + String(time.getMinutes());
      }
      else {
        mins = String(time.getMinutes());
      }      
      let dateReadable = `${hours}:${mins} ${am_pm}`;
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        //take the student and do something?

        //console.log("me");
        let tEvent = new TransactionEvent();
        tEvent.type = event;
        tEvent.time = time.getTime() +"";
        tEvent.time_readable = dateReadable;
        tEvent.by_id = by_id;
        student.events.push(tEvent);
        this.getTodaysTransaction(doc._id).then(result => {
          this.updateStudent(student, result).then(updateResult => {
            resolve(true);
          }).catch(err => {
            console.log(err);
            reject(false);
          });
        }).catch(err => {
            console.log(err);
            reject(false);
           });
      }).catch(err => {
        console.log(err);
        reject(false);
      });
    })

  }



  setNap(student_id: string, minutes:string){

    return new Promise(resolve => {
      this.getTodaysTransaction(null).then((doc: TransactionModel) => {
        this.getStudent(student_id, doc).then((me: TransactionStudentModel) => {
          let others = doc.students.filter(student => {
            return student.id + "" !== me.id + "";
          })
          let i = {
              id: me.id,
              events: me.events.map(event => {
                return {
                  type: event.type,
                  time: event.time,
                  time_readable: event.time_readable,
                  by_id: event.by_id
                }
              }),
              nap: minutes
          }
          function delta(doc) {
            doc.students = [...others, i];
            //console.log(doc.students);
            return doc;
          }
            this.db.upsert(doc._id, delta).then(() => {
              //Success!
              //console.log(`Successfully updated student with id:${me.id}`);
              resolve(true);

            }).catch(err => {
              console.log(err);
            })
        })
      })
    });
  }

  //naps
  //recieves key value pairs student_id: minutes napped
  setNaps(map: Map<string, string>){
    let array = Array.from(map);
    console.log(array);
    return this.setNapsHelper(array);
    // map.forEach((value, key, map) => {
    //   this.setNap()
    // })
  }
  //Recursive helper
  setNapsHelper(array: Array<Array<string>>){
    if(array.length <= 0){
      return Promise.resolve(true);
    }

    var s = array.splice(0,1)[0];
    this.setNap(s[0], s[1]).then(result => {
      if(result){
        return this.setNapsHelper(array);
      }else{
        return Promise.resolve(false).then(result => {
          console.log("Naps resolved false for some reason");
        });
      }
    })
  }

  //Pass date as d.m.yyyy or null for today
  //.getTransactionsById("4", null).then(result => {
    //if(result === false) -> this means it didnt work
    //else -> result is equal to an array of TransactionEvents
  //})
  getTransactionsById(studentId: string, date: any){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(date).then(result => {
         this.getStudent(studentId, result).then((student: TransactionStudentModel) => {
            resolve(student.events);
         })
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    })
  }

  clearTransactionsForDate(date:any){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(date).then((result: any) => {
        this.db.upsert(result._id, (doc) => {
          doc.students = [];
          return doc;
        }).then(result => {
          resolve(true);
        })
      }).catch(err => {
        console.log(err);
        reject(err);
      })
    })
  }

  checkinStudent(id: string, by_id: string){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then(result => {
        this.performEvent(id, result, by_id, this.CHECK_IN).then(result => {
          this.studentService.updateStudentLocation(id, this.CHECKED_IN);
          resolve(true);
        });
      });
    })
  }
  //Promise that resolves as true or false
  checkinStudents(ids: Array<string>, by_id: string){

    //creates local copy
    let s_ids = ids.map((value)=>{
      return value;
    })
    return this.checkinStudentHelper(s_ids, by_id);
  }

  checkinStudentHelper(ids, by_id){
    if(ids.length <= 0){
      return Promise.resolve(true).then(result => {

      });
    }
    //pull off the first and recurse on the rest
    var student = ids.splice(0,1);
    this.checkinStudent(student[0], by_id).then(result => {
      if(result){
        return this.checkinStudents(ids, by_id);
      }else{
        return Promise.reject(false).then(result => {
          console.log("Check in resolved false for some reason");
        });
      }
    })
  }

  //checskout of school
  checkoutStudent(id: string, by_id: string){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then(result => {
        this.performEvent(id, result, by_id, this.CHECK_OUT).then(result => {
          this.studentService.updateStudentLocation(id, this.CHECKED_OUT);
          resolve(true);
        });
      });
    });
  }

  checkoutStudents(ids: Array<string>, by_id: string){
    //creates local copy
    let s_ids = ids.map((value)=>{
      return value;
    })
    return this.checkoutStudentHelper(s_ids, by_id);
  }

  checkoutStudentHelper(ids, by_id){
    if(ids.length <= 0){
      return Promise.resolve(true).then(result => {

      });
    }
    //pull off the first and recurse on the rest
    var student = ids.splice(0,1);
    this.checkoutStudent(student[0], by_id).then(result => {
      if(result){
        return this.checkoutStudents(ids, by_id);
      }else{
        return Promise.reject(false).then(result => {
          console.log("Checkout resolved false for some reason");
        });
      }
    })
  }

  //i/o nurse
  nurseCheckout(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.NURSE_OUT);
      this.studentService.updateStudentLocation(id, this.CHECKED_OUT_NURSE);
    });
  }

  nurseCheckin(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.NURSE_IN);
      this.studentService.updateStudentLocation(id, this.CHECKED_IN);
    });
  }
  //i/o therapist
  therapistCheckout(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.THERAPY_OUT);
      this.studentService.updateStudentLocation(id, this.CHECKED_OUT_THERAPY);
    });
  }

  therapistCheckin(id: string, by_id: string){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.THERAPY_IN);
      this.studentService.updateStudentLocation(id, this.CHECKED_IN);
    });
  }


}
