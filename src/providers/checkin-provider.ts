import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { StudentProvider } from './student-provider';
import { UserProvider } from './user-provider';
import { ClassRoomProvider } from './class-room-provider';


import { LoggingProvider } from './logging-provider';

import { TransactionModel, TransactionStudentModel, TransactionEvent, TransactionTherapy,
      BillingDay, BillingWeekModel, StudentBillingWeek, ClassroomWeek} from '../models/db-models';

import PouchDB from 'pouchdb';

/*
  Generated class for the CheckinProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CheckinProvider {

  //These are the strings that go in the events as the tag
  CHECK_IN = 'checkin';
  CHECK_OUT = 'checkout';
  NURSE_IN = 'checkinByNurse';
  NURSE_OUT = 'checkoutByNurse';
  THERAPY_IN = 'checkinByTherapist';
  THERAPY_OUT = 'checkoutByTherapist';
  THERAPY_OUT_OT = 'checkoutByTherapistOT';
  THERAPY_OUT_PT = 'checkoutByTherapistPT';
  THERAPY_OUT_SLP = 'checkoutByTherapistSLP';

  //These are the strings that get pushed to the student for 'location'
  CHECKED_OUT = 'Checked out';
  CHECKED_IN = 'Checked in/In classroom';
  CHECKED_OUT_THERAPY = 'Therapist checked student out';
  CHECKED_OUT_THERAPY_OT = 'OT ' + this.CHECKED_OUT_THERAPY;
  CHECKED_OUT_THERAPY_PT = 'PT ' + this.CHECKED_OUT_THERAPY;
  CHECKED_OUT_THERAPY_SLP = 'SLP ' + this.CHECKED_OUT_THERAPY;
  CHECKED_OUT_NURSE = 'Nurse checked student out';

  db: any;
  billingdb: any;
  remote: any;
  billingRemote: any;

  constructor(public http: Http, public loggingService: LoggingProvider, public studentService: StudentProvider, public userService: UserProvider, public classroomService: ClassRoomProvider) {
    console.log('Hello CheckinProvider Provider');

    this.db = new PouchDB('transactions');
    this.billingdb = new PouchDB('billing');

    PouchDB.plugin(require('pouchdb-upsert'));

    // this.billingRemote = 'https://christrogers:christrogers@christrogers.cloudant.com/billing';
    this.billingRemote = 'http://chris:couchdbadmin5@104.197.130.97:5984/billing';
    // this.billingRemote = 'http://localhost:5984/billing';

    // this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/transactions';
    this.remote = 'http://chris:couchdbadmin5@104.197.130.97:5984/transactions';
    // this.remote = 'http://localhost:5984/transactions';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options)
    .on('change', function (info) {
      console.log('transactions\tchange');
      // handle change
    }).on('paused', function (err) {
      console.log('transactions\tpaused');
      // replication paused (e.g. replication up to date, user went offline)
    }).on('active', function () {
      console.log('transactions\tactive');
      // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
      console.log("transactions\tdenied:");
      console.log(err);
      // a document failed to replicate (e.g. due to permissions)
    }).on('complete', function (info) {
      console.log("transactions\tsync complete\tinfo:");
      console.log(info);
      // handle complete
    }).on('error', function (err) {
      console.log("transactions\tsync error");
      console.log(err);
      // handle error
    });
    this.billingdb.sync(this.billingRemote, options)
    .on('change', function (info) {
      console.log('billing\tchange');
      // handle change
    }).on('paused', function (err) {
      console.log('billing\tpaused');
      // replication paused (e.g. replication up to date, user went offline)
    }).on('active', function () {
      console.log('billing\tactive');
      // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
      console.log("billing\tdenied:");
      console.log(err);
      // a document failed to replicate (e.g. due to permissions)
    }).on('complete', function (info) {
      console.log("billing\tsync complete\tinfo:");
      console.log(info);
      // handle complete
    }).on('error', function (err) {
      console.log("billing\tsync error");
      console.log(err);
      // handle error
    });
  }

  getTodaysTransaction(dateString: string){
    //if not supplied, set to today. format is d.m.y i.e. (27.1.2017)
    if(dateString === null){
      let today = new Date();
      dateString = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    }

  	return new Promise((resolve) => {
  		this.db.allDocs({include_docs: true}).then(result => {
        //console.log(result);
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
            this.loggingService.writeLog("Successfully added transaction table for day: " + dateString);
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
          return this.getTodaysTransaction(doc._id);
          //return this.getStudent(id, doc);
        }).then(result => {
          resolve(this.getStudent(id, result));
        }).catch(err => {
          console.log(err);
        });
      }else{
        //Resolves with the student's info from the db
        let student = new TransactionStudentModel();
        student.id = me[0].id;
        student.events = me[0].events;
        student.nap = me[0].nap;
        student.therapies = me[0].therapies;
        if(me[0].nap_subtract){
          student.nap_subtract = me[0].nap_subtract;
        }
        this.loggingService.writeLog(`Successfully created student ${student.id} in transaction database`);
        resolve(student);
      }
    })
  }
  //Takes the student model and pushes/replaces the info in the db with the model's data
  updateStudent(me: TransactionStudentModel, doc){

    let others = doc.students.filter(student => {
      return student.id + "" !== me.id + "";
    });
    //copying info
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
        nap_subtract: me.nap_subtract,
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
        resolve(true);

      }).catch(err => {
        console.log(err);
      })
    });

  }

  //Event is the constants from the top
  performEvent(id: string, doc: any, by_id: string, event: string, nap_subtract? : number){

    //If the student has not interacted yet with checkin today
    return new Promise((resolve, reject) => {
      let time = new Date();
      let dateReadable = this.createReadableTime(Date.now());
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        //take the student and do something?

        let tEvent = new TransactionEvent();
        tEvent.type = event;
        tEvent.time = time.getTime() +"";
        tEvent.time_readable = dateReadable;
        tEvent.by_id = by_id;
        student.events.push(tEvent);
        if(nap_subtract){
          console.log(student.nap_subtract);
          student.nap_subtract += nap_subtract;
          console.log(student.nap_subtract);
        }

        //Get updated today's transaction incase _rev has changed, then push tEvent in
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

  //Push nap value for this student, very similar to updateStudent
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
              nap: Number(minutes),
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
    //breaks binding from before... before splicing in helper method
    let array = Array.from(map);
    return this.setNapsHelper(array);
  }

  //Recursive helper
  setNapsHelper(array: Array<Array<string>>){

    //Base case
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

  //Used with normalize
  clearTransactionsForDate(date:any){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(date).then((result: any) => {
        this.db.upsert(result._id, (doc) => {
          //Nukes all events for the day
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

  checkLimbo(id: string, doc: TransactionModel){
    return new Promise((resolve, reject) => {
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        var isInLimbo = true;
        student.events.forEach((event: TransactionEvent) => {
          if(event.type === this.CHECK_IN){
            isInLimbo = false;
          }
        });
        resolve(isInLimbo);
      }).catch(err => {
        //TODO
        console.log(err);
      });
    })
  }

  //Uses performEvent to check in student and update student location in students table
  checkinStudent(id: string, by_id: string){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then((result: TransactionModel) => {
        this.performEvent(id, result, by_id, this.CHECK_IN).then(result => {
          this.studentService.updateStudentLocation(id, this.CHECKED_IN).then(() => {
            this.loggingService.writeLog(`Student with id:${id} was checked in`);
            resolve(true);
          });
        });

      })
    });

  }

  //Promise that resolves as true or false
  checkinStudents(ids: Array<string>, by_id: string){

    //creates local copy
    let s_ids = ids.map((value)=>{
      return value;
    })
    return this.checkinStudentHelper(s_ids, by_id);
  }

  //Similar to nap
  checkinStudentHelper(ids, by_id){
    if(ids.length <= 0){
      return Promise.resolve(true);
    }
    //pull off the first and recurse on the rest
    var student = ids.splice(0,1);
    this.checkinStudent(student[0], by_id).then(result => {
      if(result){
        return this.checkinStudentHelper(ids, by_id);
      }else{
        return Promise.reject(false).then(result => {
          console.log("Check in resolved false for some reason");
        });
      }
    })
  }

  isInTherapyLimbo(id: string) {
    return this.studentService.data.get(id).location.includes(this.CHECKED_OUT_THERAPY);

  }

  //checkout of school
  checkoutStudent(id: string, by_id: string){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then((result: TransactionModel) => {
        this.checkLimbo(id, result).then((isInLimbo) =>{
          if(!isInLimbo){
            this.performEvent(id, result, by_id, this.CHECK_OUT).then(result => {
              if(this.isInTherapyLimbo(id)){
                this.therapistCheckin(id, by_id).then((therapy : TransactionTherapy) => {
                  let length = (new Date().getTime() - Number(therapy.start_time))/(1000*60);
                  this.therapistCheckinFollowUp(id, by_id, therapy.start_time +"", length, 0).then(() => {
                    this.studentService.updateStudentLocation(id, this.CHECKED_OUT).then(() =>{
                      this.loggingService.writeLog(`Student with id:${id} was checked out`);
                      resolve(true);
                    });
                  });
                })
              }else{
                this.studentService.updateStudentLocation(id, this.CHECKED_OUT).then(() =>{
                  this.loggingService.writeLog(`Student with id:${id} was checked out`);
                  resolve(true);
                });
              }
            });
          }else{
            this.studentService.updateStudentLocation(id, this.CHECKED_OUT).then(() => {
              this.loggingService.writeLog(`Student with id:${id} was checked out`);
              resolve(true);
            });
          }
        })
      });
    });
  }

  //same as checkin plurality
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
        return this.checkoutStudentHelper(ids, by_id);
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
      this.performEvent(id, result, by_id, this.NURSE_OUT).then(() => {
        this.loggingService.writeLog(`Student with id:${id} was checked out of the classroom by id: ${by_id}`);
        this.studentService.updateStudentLocation(id, this.CHECKED_OUT_NURSE);
      });
    });
  }

  nurseCheckin(id: string, by_id: string, nap_subtract?: number){
    this.getTodaysTransaction(null).then(result => {
      this.performEvent(id, result, by_id, this.NURSE_IN, nap_subtract).then(() => {
        this.loggingService.writeLog(`Student with id:${id} was checked into the classroom by id: ${by_id}`);
        this.studentService.updateStudentLocation(id, this.CHECKED_IN);
      })
    });
  }

  //Checkout a student to therapy, adds a therapy start as well
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
        this.addTherapyStart(id, by_id, Date.now(), result).then(() => {
          this.loggingService.writeLog(`Student with id:${id} was checked out by therapist with id: ${by_id}`);
          this.studentService.updateStudentLocation(id, location);
        });
      });
    });
  }

  //This creates an event-esque item for a therapy session that has -1 as a length to know it is incomplete
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

  //Checks a student back in, requires follow up method afterwards to be complete
  //Returns the incomplete therapy to be shown to the screen (dbmodels.TransactionTherapy)
  therapistCheckin(id: string, by_id: string){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(null).then(result => {
        this.getIncompleteTherapy(id, result).then((therapy: TransactionTherapy) => {
          this.loggingService.writeLog(`Student with id:${id} was checked into the classroom from therapy`);
          resolve(therapy);
        })
      }).catch(err => {
        console.log(err);
        reject(false);
      });
    })
  }

  //Gets the item that is length -1, theoretically there should never be more than 1
  getIncompleteTherapy(id: string, doc: any){
    return new Promise((resolve, reject) => {
      this.getStudent(id, doc).then((student: TransactionStudentModel) => {
        let incompletes = student.therapies.filter(therapy => {
          return therapy.length === -1;
        });
        if(incompletes.length <= 0){
          reject(false);
        }else{
          resolve(incompletes[0]);
        }
      }).catch(err => {
          reject(false);
        });
    })
  }

  getAllTherapies(id:string){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(null).then(doc => {
        this.getStudent(id, doc).then((student: TransactionStudentModel) => {
          resolve(student.therapies);
        })
      }).catch(err => {
        reject(false);
      })
    })
  }

  //on follow up write the therapy length in
  therapistCheckinFollowUp(student_id: string, by_id: string, start_time: string, length: Number, nap_subtract: Number){
    return new Promise(resolve => {
      this.getTodaysTransaction(null).then((doc: TransactionModel) => {
        this.getStudent(student_id, doc).then((me: TransactionStudentModel) => {

          this.performEvent(student_id, doc, by_id, this.THERAPY_IN).then(val => {
            this.studentService.updateStudentLocation(student_id, this.CHECKED_IN);


            let others = doc.students.filter(student => {
              return student.id + "" !== me.id + "";
            });
            let t_model = new TransactionTherapy();
            t_model.start_time = start_time;
            t_model.length = length;
            t_model.nap_subtract = nap_subtract;
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
                therapies: [...otherTherapies, {start_time: t_model.start_time, length: t_model.length,
                  by_id: t_model.by_id, nap_subtract: t_model.nap_subtract}]
            }
            function delta(doc) {
              doc.students = [...others, i];
              //console.log(doc.students);
              return doc;
            }

            this.db.upsert(doc._id, delta).then(() => {
              //Success!
              //console.log(`Successfully updated student with id:${me.id}`);

              this.loggingService.writeLog(`Student with id:${student_id} was checked in by therapist with id: ${by_id}`);
              resolve(true);

            }).catch(err => {
              console.log(err);
            })
          });

        })
      })
    });
  }

  //returns billable hours for the day, = now/checkout time - checkin time - total therapy time
  getBillableHours(student_id: string, date: string){
    return new Promise((resolve, reject) => {
      this.getTodaysTransaction(date).then(doc => {
        this.getStudent(student_id, doc).then((student: TransactionStudentModel) => {
          let totalTherapyTime = 0;
          student.therapies.forEach(t => {
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

  //Helper function for creating a readable time
  createReadableTime(time_millis: number){
    let time = new Date(time_millis);

    let mins: string;
    let am_pm = "AM";
    let hours = String(time.getHours());
    if (time.getHours() >= 12 && time.getHours() != 0){
      hours = String(time.getHours() - 12);
      if(hours === "0"){
        hours = "12";
      }
      am_pm = "PM";
    }
    if (time.getMinutes() < 10){
      mins = "0" + String(time.getMinutes());
    }
    else {
      mins = String(time.getMinutes());
    }
    return `${hours}:${mins} ${am_pm}`
  }

  //helper for parsing a readable time into millis
  parseReadableTime(dateString: string) {
    var dontCare = dateString.split(":");
    var rest = dontCare[1].split(" ");
    var hours = Number(dontCare[0]);
    var minutes = Number(rest[0]);
    var AMPM = rest[1];
    if(AMPM.toLowerCase() === "pm") {
      hours += 12;
    }
    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    console.log(date.getTime());
    return date.getTime();
  }

  getClassroomBilling(room_number: String, callback){
    this.billingdb.allDocs({include_docs: true}).then(result => {

        //get today's object, if it does not exist, create it
        //console.log(result);
        let trans = result.rows.filter((row) => {
          return row.doc._id === room_number;
        });
        //console.log(trans);
        //Day already exists in the db
        if(trans.length > 0){
          console.log(trans[0]);
          let room = new ClassroomWeek();
          room.room_number = trans[0].doc.room_number;
          room.weeks = trans[0].doc.billingWeeks;
          //console.log(room);
          //console.log("resolving from getClassroomBilling")
          callback(room);
          return;
        }else{
          //Day did not exist, creates and puts it
          this.billingdb.upsert(room_number, (doc) => {
            return {
              _id: room_number,
              room_number: room_number,
              billingWeeks: []
            }
          }).then(response => {
            //unsure how to do this without recursion. basically since it has been added to the db,
            //it will on recursion go into the other part of the if/else
            console.log("Successfully added billing document for room: " + room_number)
            console.log(`Recursing ${room_number}`)
            this.getClassroomBilling(room_number, callback);
          }).catch(function (err) {
            console.log(err);
          });
        }
     }).catch(err =>{
        console.log(err)
    });
  }

  getBillingWeek(start_date: Date, room_number: String){
    var dateString = `${room_number}`;
    return new Promise((resolve, reject) => {
      this.getClassroomBilling(room_number, (cw: ClassroomWeek) => {
        resolve(cw);
      })
    });
  }



  writeBillingWeek(start_date: Date, room_number: String){
   //these are metadata
    return new Promise((resolve, reject) => {
    //this is the data
      var ids = this.classroomService.data.get(room_number).students;

      this.writeBillingWeekHelper(ids, start_date, [], (billing_week: BillingWeekModel) => {
        billing_week.room_number = room_number;

        //upsert
        var dateString = `${room_number}`;
        this.getClassroomBilling(room_number, (doc: ClassroomWeek) => {
          //console.log(doc);
          let others = doc.weeks.filter((week: BillingWeekModel) => {
            var sd = new Date(week.start_date);
            return start_date.getDate() !== sd.getDate() ||
              start_date.getMonth() !== sd.getMonth() ||
              start_date.getFullYear() !== sd.getFullYear();
          });
          let me = billing_week;
          this.billingdb.upsert(room_number, (document) => {
            //console.log(me);
            document.billingWeeks = [...others, me]
            //console.log(document);
            return document;
          }).then(response => {
            //unsure how to do this without recursion. basically since it has been added to the db,
            //it will on recursion go into the other part of the if/else
            console.log("Successfully added bills for week: " + dateString);
            resolve();
            //resolve();
          }).catch(function (err) {
            console.log("UPSERT ERROR?")
            console.log(err);
            reject();
          });
        })
        //console.log(`theoretical end`);
        //console.log(billing_week);
      })
    })


  }

  writeBillingWeekHelper(s_ids: Array<String>, start_date: Date, data: Array<StudentBillingWeek>, callback){
    let ids = Array.from(s_ids);
    if(ids.length <= 0){
      const billing_week = new BillingWeekModel();
      billing_week.students = data;
      billing_week.start_date = start_date;

      //percent or something
      var count = 0;
      var hours = 0;
      //console.log("BASECASE IDS.LENGTH = 0 HELPER");
      //console.log(billing_week.students)
      billing_week.students.forEach(student => {
        count++;
        hours += student.average_hours_billed_per_day;
      });

      billing_week.billing_percent = (hours / count / 5) * 100;
      console.log("ASDASD")
      console.log(billing_week)
      callback(billing_week);
      return;
    }


    //console.log("IDS" + ids.length);
    //console.log(ids);
    var currentID = ids.splice(0,1);
    //console.log(currentID);
    this.createBillingWeek(String(currentID[0]), start_date).then((sbw:StudentBillingWeek) => {
      data.push(sbw);
      this.writeBillingWeekHelper(ids, start_date, data, callback);
    })
  }


  createBillingWeek(s_id: string, start_date:Date){
    var array = [];
    for(var i = 0; i < 5; i++){
      array.push(new Date(start_date.getTime() + (i * 1000 * 60 * 60 * 24)));
    }
    return new Promise(resolve => {

      this.createBillingWeekHelper(s_id, array, [], (sbw:StudentBillingWeek) => {
        resolve(sbw);
      });

    })
  }

  createBillingWeekHelper(s_id: string, dates: Array<Date>, data: Array<BillingDay>, callback){
    if(dates.length <= 0){
        var week = new StudentBillingWeek();
        week.student_days = data;
        week.student_id = s_id;

        //calculate avg billed hours
        var count = 0;
        var totalBilled = 0;
        //console.log(data)
        data.forEach(day => {
          //if(day.billable_hours > 0){
            count++;
            totalBilled += day.billable_hours;
          //}
        })
        week.average_hours_billed_per_day = totalBilled/count;
        //console.log(week);
        callback(week);
        return;
    }

    var currentDate = dates.splice(0,1);
    this.createBillingDay(s_id, currentDate[0]).then((billingDay: BillingDay) => {
      data.push(billingDay);
      this.createBillingWeekHelper(s_id, dates, data, callback);
    })

  }

  createBillingDay(s_id:string, date:Date){
    return new Promise((resolve, reject) => {
      const day = new BillingDay();
      const dateString = `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
      this.getTodaysTransaction(dateString).then(doc => {
        this.getStudent(s_id, doc).then((student:TransactionStudentModel) => {

          //If student nap is set for the day
          if(!isNaN(Number(student.nap)) && Number(student.nap) >= 0){
            day.nap_hours = Number(student.nap).valueOf() / 60;
          }else{
            day.nap_hours = 0;
          }

          //event info
          student.events.forEach((event:TransactionEvent) => {
            if(day.start_time < 0 && event.type === this.CHECK_IN){
              day.start_time = Number(event.time);
            }
            if(day.end_time < 0 && event.type === this.CHECK_OUT){
              day.end_time = Number(event.time);
            }
          });

          //if not checked out for the day, but checked in, the checkout time for billing is set to 3:00PM
          if(day.end_time < 0 && day.start_time > 0){
            var d = new Date(date.getTime());
            d.setHours(15,0,0,0);
            day.end_time = d.getTime();
          }

          //if both are set, start doing total calculations
          if(day.start_time >= 0 && day.end_time >= 0){
            day.gross_hours = (day.end_time - day.start_time) / (1000 * 60 * 60);
          }

          day.attendanceWarning = day.gross_hours < 7;

          //therapy info
          var totalTherapy = 0;
          if(student.therapies){
            student.therapies.forEach((therapy:TransactionTherapy) => {
              var type = this.userService.data.get(therapy.by_id).therapy_type;
              //console.log("Therapy type: " + type);
              var therapyLength = therapy.length.valueOf() / 60;
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

              if(therapy.nap_subtract){
                day.nap_hours -= therapy.nap_subtract.valueOf() / 60;
              }


            })

            day.therapyWarning = totalTherapy > 1

          }
          //net hours = gross - nap - therapy
          if(day.gross_hours > 0){
            day.net_hours = day.gross_hours - day.nap_hours - totalTherapy;
          }else{
            day.net_hours = -1;
          }

          //billable = min(net, 5).truncate
          if(day.net_hours > 0){
            day.billable_hours = Math.floor(Math.min(day.net_hours, 5));
          }else{
            day.billable_hours = -1;
          }

          day.billingWarning = day.billable_hours < 5;

          resolve(day);
        })
      })

    })

  }

}
