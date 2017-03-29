import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {StudentModel} from '../models/db-models';
import {LoggingProvider} from './logging-provider';
import {UtilityProvider} from './utility-provider';

@Injectable()
export class StudentProvider {
  data: Map<String, StudentModel>;
  private roomRoster: Array<String>;
  db: any;
  remote: String;

  constructor(public loggingService: LoggingProvider, public utilityService: UtilityProvider) {
    this.data = new Map<String,StudentModel>();
    this.roomRoster = new Array<String>();

    let credentials = utilityService.returnCredentialObject();

    if(credentials && credentials.username){
      //setup a local db and then sync it to a backend db
      this.db = new PouchDB('students');

      // this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/students';
      // this.remote = 'http://localhost:5984/students';
      this.remote = 'http://'+credentials.username+':'+credentials.password+'@104.197.130.97:5984/students';

      let options = {
        live: true,
        retry: true,
        back_off_function: function (delay) {
          if (delay === 0){
            console.log("something failed retrying");
          } else {
            console.log("Doing the 2000");
          }
          return 2000;
        }
      };

      this.db.sync(this.remote, options)
      .on('change', function (info) {
        // console.log('students\tchange');
        // handle change
      }).on('paused', function (err) {
        // console.log('students\tpaused');
        // replication paused (e.g. replication up to date, user went offline)
      }).on('active', function () {
        // console.log('students\tactive');
        // replicate resumed (e.g. new changes replicating, user went back online)
      }).on('denied', function (err) {
        // console.log("students\tdenied:");
        console.log(err);
        // a document failed to replicate (e.g. due to permissions)
      }).on('complete', function (info) {
        // console.log("students\tsync complete\tinfo:");
        // console.log(info);
        // handle complete
      }).on('error', function (err) {
        // console.log("students\tsync error");
        console.log(err);
        // handle error
      });
    } else {
      alert('Something went wrong, please refresh your browser');
    }
  }

  forceInit(){
    //tell the db what to do when it detects a change
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change => {
      this.handleChange(change);
    });
  }

  getStudents(){
    //we should do an initial gathering of docs
    return new Promise((resolve, reject) =>{
      this.data = new Map<String, StudentModel>();

      //start with key 0 and end with any key starting with a 9, this is to dodge other database docs like _view type metadata
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        result.rows.map(row => {
          this.data.set(row.doc._id, (row.doc));
        });
        resolve(this.data);
      }).catch(error =>{
        console.log(error);
        reject(error);
      });
    });
  }

  getStudentsByGroup(IDs: Array<String>){
    //currently using get all with include docs then filter
    //could possibly see speed up if we do get all with out docs then filter then bulkget with that set of ids and revs
    //but probably only see speed up with huge docs
    this.roomRoster = IDs;

    return new Promise((resolve, reject) => {
      this.data = new Map<String, StudentModel>();
      //start with key 0 and end with any key starting with a 9, this is to dodge other database docs like _view type metadata
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        result.rows.map(row => {
          //if the row.doc._id is not in the array of input IDs then it shouldn't be included
          if(~this.roomRoster.indexOf(row.doc._id)){
            this.data.set(row.doc._id, row.doc);
          }
        });
        resolve(this.data);
      }).catch(error => {
        console.log(error)
        reject(error);
      });
    });
  }

  createStudent(student: StudentModel){
    //if student._id is not -1 the user supplied an ID rather than getting an auto generated one
    if(Number(student._id) >= 0){
      this.updateStudent(student);
      this.data.set(student._id, student);

      return new Promise(resolve=>{
        resolve(student._id);
      })
    } else {

      let newID: String = "-1";
      //find the next available id number
      return new Promise((resolve, reject) =>{
        this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {

          result.rows.map(row => {
            if(Number(newID) <= Number(row.id)){
               newID = String((Number(row.id) + 1));
             }
          });

          student._id = newID;
          // this.db.put(student).catch(err=>{
          //   console.log(err)
          // })
          this.data.set(student._id, student);
          this.db.upsert(student._id, (() =>{return student})).catch((err)=>{
            console.log(err);
          }).then(() => {

            this.loggingService.writeLog(`Student with id: ${student._id} has been created`);
          });
          //return the generated id so that we can let the student know their id, may not be needed
          resolve(newID);
        }).catch((err)=>{
          console.log(err);
          reject(err);
        });
      });
    }
  }

//Chris 1/27/17 commenting this out so no one accidentally uses it
//as of now this method of creating a student is not used, refer to createStudent(:StudentModel)
  // createStudentByInfo(fName: String, lName: String, loc: String, note: String, icon: String){
  //   let newID: String = "-1";
  //
  //   return new Promise(resolve =>{
  //   //find the next available id number
  //     this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {
  //
  //       result.rows.map(row => {
  //         if(Number(newID) <= Number(row.id)) newID = String((Number(row.id) + 1));
  //       });
  //
  //       //create an object and send it to the db
  //       let student = new StudentModel();
  //       student._id = newID;
  //       student.fName = fName;
  //       student.lName = lName;
  //       student.location = loc;
  //       student.note = note;
  //       student.icon = icon;
  //
  //       // this.db.put(student).catch(err=>{
  //       //   console.log(err)
  //       // })
  //       this.data.set(student._id, student);
  //       this.db.upsert(student._id, (() =>{return student}));
  //
  //       //return the generated id so that we can let the student know their id, may not be needed
  //       return newID;
  //     });
  //   });
  // }

  updateStudent(student: StudentModel){
    this.db.upsert(student._id, (() => {return student})).then(()=>{
      this.loggingService.writeLog(`Student with id: ${student} has been updated`);
    }).catch((err)=>{
      console.log(err);
    });
    // this.db.put(student).catch(err => {
    //   console.log(err);
    // });
  }

  updateStudentLocation(ID: String, Location: String){
    return new Promise((resolve,reject) => {
      //retrieve the student document, we need this because we need revision history
      this.db.get(ID).then(doc => {
        doc.location = Location;
        //update the db with the modified student document
        this.db.put(doc).then(() => {
          this.loggingService.writeLog(`Student with id: ${ID} has been updated to location: ${Location }`);
          resolve(doc);
        }).catch(err =>{
          console.log(err);
          resolve("False")
        });
        //return the document incase we need any kind of error checking or resolution
      }).catch(err => {
        console.log(err);
        let errMessage = new StudentModel();
        errMessage._id = "missing";
        resolve(errMessage);
      });
    });
  }

  updateStudents(students: Array<StudentModel>){

    //TODO might could be done better in a bulk doc if we see that we need speed up
    for(let student of students){
      this.updateStudent(student);
    }

    /* or maybe
    this.db.bulkDocs(students).catch(err => {
      console.log(err);
    });
    */
  }

  deleteStudent(student: StudentModel){
    //this.db.upsert(student._id, ((doc)=>{doc._deleted = true; return doc}));

    return new Promise(resolve => {
      this.db.upsert(student._id, ((doc)=>{doc._deleted = true; return doc})).then(() => {
        this.loggingService.writeLog(`Student with id: ${student} has been deleted`);
      }).catch((err)=>{
        console.log(err);
      });
      if(Number(student._id) >= 0){
        this.data.delete(student._id);
      }
      console.log("just tried to delete: ");
      console.log(student);
      resolve();
    });
  }

  checkoutAllStudents(){
    let studentDocs = new Array<StudentModel>();
    this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {

      result.rows.map(row => {
        row.doc.location = "Checked out";
        studentDocs.push(row.doc);
      });

      console.log(studentDocs);

      this.db.bulkDocs(studentDocs).catch(err=>{
        console.log(err);
      });

    }).catch(error =>{
      console.log(error);
    });
  }

  //Maybe add some methods for directly accessing the data object?


  handleChange(change){

    //if roomRoster is set then we need to make sure that people who are not part of roomRoster aren't added to the data object
    //otherwise the data object should have everyone
    if(this.roomRoster.length > 0){
      //if the changed student id is not in the roomRoster then proceed with the updates

      if(~this.roomRoster.indexOf(change.doc._id)){
        if(change.deleted){
          this.data.delete(change.doc._id);
        } else {
          this.data.set(change.doc._id, change.doc);
        }
      }
    } else {
      if(change.deleted){
        this.data.delete(change.doc._id);
      } else {
        this.data.set(change.doc._id, change.doc);
      }
    }
  }
}
