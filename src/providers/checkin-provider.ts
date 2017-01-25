import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { StudentProvider } from './student-provider';
import { UserProvider } from './user-provider';

import { TransactionModel, TransactionStudentModel, TransactionEvent, TransactionTherapy} from '../models/db-models';

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
  THERAPY_OUT_OT = 'checkoutByTherapistOT';
  THERAPY_OUT_PT = 'checkoutByTherapistPT';
  THERAPY_OUT_SLP = 'checkoutByTherapistSLP';

  CHECKED_OUT = 'Checked out';
  CHECKED_IN = 'Checked in/In classroom';
  CHECKED_OUT_THERAPY = 'Therapist checked student out';
  CHECKED_OUT_THERAPY_OT = 'OT ' + this.CHECKED_OUT_THERAPY;
  CHECKED_OUT_THERAPY_PT = 'PT ' + this.CHECKED_OUT_THERAPY;
  CHECKED_OUT_THERAPY_SLP = 'SLP ' + this.CHECKED_OUT_THERAPY;;
  CHECKED_OUT_NURSE = 'Nurse checked student out';

  db: any;
  remote: any;

  constructor(public http: Http, public studentService: StudentProvider, public userService: UserProvider) {
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
      doc.students = [...doc.students, {id:id, events: [], nap: -1, therapies: []}];
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
        student.nap = me[0].nap;
        student.therapies = me[0].therapies;
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
        }),
        nap: me.nap,
        therapies: me.therapies
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
              nap: minutes,
              therapies: me.therapies
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
        return Promise.reject(false).then(result => {
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
  therapistCheckout(id: string, by_id: string, therapy_type: string){
    this.getTodaysTransaction(null).then(result => {
      let event_type = "";
      let location = ""
      switch(therapy_type){
        case 'OT':
          event_type = this.THERAPY_OUT_OT;
          location = this.CHECKED_OUT_THERAPY_OT;
          break;
        case 'PT':
          event_type = this.THERAPY_OUT_PT;
          location = this.CHECKED_OUT_THERAPY_PT;
          break;
        case 'SLP':
          event_type = this.THERAPY_OUT_SLP;
          location = this.CHECKED_OUT_THERAPY_SLP;
          break;
        default:
          event_type = this.THERAPY_OUT;
          location = this.CHECKED_OUT_THERAPY;

      }
      this.performEvent(id, result, by_id, event_type).then(response => {
        this.addTherapyStart(id, by_id, Date.now(), result);
      });
      this.studentService.updateStudentLocation(id, location);
    });
  }

  addTherapyStart(id, by_id: string, date: number, doc: any){
    return new Promise((resolve, reject) => {
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        //take the student and do something?
        var t = new TransactionTherapy();
        t.by_id = by_id;
        t.start_time = date + "";
        t.length = -1;
        student.therapies.push(t);
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

  therapistCheckin(id: string, by_id: string){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(null).then(result => {
        this.performEvent(id, result, by_id, this.THERAPY_IN).then(val => {
          this.studentService.updateStudentLocation(id, this.CHECKED_IN);
          //resolve with the correct data (student's events for today)
          this.getIncompleteTherapy(id, result).then((therapy: TransactionTherapy) => {
            resolve(therapy);
          })
        });
      }).catch(err => {
        console.log("ERRERERERERE" + err);
        reject(false);
      });
    })
  }

  getIncompleteTherapy(id: string, doc: any){
    return new Promise((resolve, reject) => {
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        let incompletes = student.therapies.filter(therapy => {
          return therapy.length === -1;
        });
        if(incompletes.length <= 0){
          console.log("ASDFSADFASDF");
          reject(false);
        }else{
          resolve(incompletes[0]);
        }
      }).catch(err => {
          console.log("ERERERER" + err);
          reject(false);
        });
    })
  }

  therapistCheckinFollowUp(student_id: string, by_id: string, start_time: string, length: Number){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then((doc: TransactionModel) => {
        this.getStudent(student_id, doc).then((me: TransactionStudentModel) => {
          let others = doc.students.filter(student => {
            return student.id + "" !== me.id + "";
          });
          let t_model = new TransactionTherapy();
          t_model.start_time = start_time;
          t_model.length = length;
          t_model.by_id = by_id;
          let otherTherapies = me.therapies.filter(therapy => {
            return therapy.length !== -1;
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
              nap: me.nap,
              therapies: [...otherTherapies, {startTime: t_model.start_time, length: t_model.length, by_id: t_model.by_id}]
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

  getBillableHours(student_id: string, date: string){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(date).then(doc => {
        this.getStudent(student_id, doc).then((student: TransactionStudentModel) => {
          let totalTherapyTime = 0;
          student.therapies.forEach(t => {
            ////UGHHHH Number VS number
            if(t.length > 0 ){
              totalTherapyTime += t.length.valueOf();
            }
          });
          let checkInTime = 0;
          let checkOutTime = 0;
          student.events.forEach((event:TransactionEvent) => {
            if(checkInTime === 0 && event.type === this.CHECK_IN){
              checkInTime = Number(event.time);
            }else if(checkOutTime === 0 && event.type === this.CHECK_OUT){
              checkOutTime = Number(event.time);
            }
          });

          if(checkOutTime === 0){
            checkOutTime = Date.now();
          }

          if(checkInTime === 0){
            resolve(0);
          }else{
            let v = checkOutTime - checkInTime - (totalTherapyTime * 1000 * 60);
            resolve((v / (1000 * 60 * 60)));
          }
        })
      })
    })
  }

}
