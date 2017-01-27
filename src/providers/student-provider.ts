import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {StudentModel} from '../models/db-models';

@Injectable()
export class StudentProvider {
  data: Map<String, StudentModel>;
  private roomRoster: Array<String>;
  db: any;
  remote: String;

  constructor() {

    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('students');

    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/students';
    //this.remote = 'http://localhost:5984/students';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  forceInit(){
    console.log("student provider force init");
  }

//I don't think this will be used and if it is it needs to be updated as it will make this.data inconsistent with getStudentsByGroup
  getStudents(){
    //if this provider already has the data, just return it
    //future changes to db will be auto synchronized

    //  this would be used to reduce the number of calls to the db
    //  currently the setup is to only call the db once per room selection, therefore this isn't necessary
    //  Chris 1/13/2017 commented this out so that there wouldn't be any weird bugs involving trying to get all the students and only getting students from a previously selected room
    // if(this.data){
    //   return Promise.resolve(this.data);
    // }

    //otherwise we should do an initial gathering of docs
    return new Promise(resolve =>{
      this.data = new Map<String, StudentModel>();

      //start with key 0 and end with any key starting with a 9, this is to dodge other database docs like _view type metadata
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {

        result.rows.map(row => {
          this.data.set(row.doc._id, (row.doc));
        });
        resolve(this.data);


        //tell the db what to do when it detects a change
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change => {
          this.handleChange(change);
        });
      }).catch(error =>{
        console.log(error);
      });
    });
  }

  getStudentsByGroup(IDs: Array<String>){
    //currently using get all with include docs then filter
    //could possibly see speed up if we do get all with out docs then filter then bulkget with that set of ids and revs
    //but probably only see speed up with huge docs
    this.roomRoster = IDs;

    return new Promise(resolve => {
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

        //tell the db what to do when it detects a change
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change => {
          this.handleChange(change);
        });
      }).catch(error => {
        console.log(error)
      });
    });
  }

  //work in progress, development tabled until use case arises
  /*getStudentByFullName(name){
    let found = false;

    for(let row of this.data){
      if(row.fName+" "+row.lName === name){
        found = true;
        return Promise.resolve(row);
      }
    }

    if(!found){}
  }*/

  createStudent(student: StudentModel){
    let newID: String = "-1";
    //find the next available id number
    return new Promise(resolve =>{
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
        this.db.upsert(student._id, (() =>{return student}));

        //return the generated id so that we can let the student know their id, may not be needed
        resolve(newID);
      });
    });
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
    this.db.upsert(student._id, (() => {return student}));
    // this.db.put(student).catch(err => {
    //   console.log(err);
    // });
  }

  updateStudentLocation(ID: String, Location: String){
    return new Promise(resolve => {
      //retrieve the student document, we need this because we need revision history
      this.db.get(ID).then(doc => {
        doc.location = Location;
        //update the db with the modified student document
        this.db.put(doc).catch(err =>{
          console.log(err);
        });
        //return the document incase we need any kind of error checking or resolution
        resolve(doc);
      }).catch(err => {
        console.log(err);
        let errMessage = new StudentModel();
        errMessage._id = "missing";
        resolve(errMessage);
      });
    });
  }

  updateStudents(students: Array<StudentModel>){
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
      this.db.upsert(student._id, ((doc)=>{doc._deleted = true; return doc}));
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
      }).catch(err=>{
        console.log(err);
      });

    }).catch(error =>{
      console.log(error);
    });
  }

  //Maybe add some methods for directly accessing the data object?


  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;


    if(this.roomRoster){
      if(~this.roomRoster.indexOf(change.id)){
        //scan the docs for the one that has been changed
        this.data.forEach((doc, index) =>{
          if(doc._id === change.id){
            changedDoc = doc;
            changedIndex = index;
          }
        });

        if(change.deleted){
          this.data.delete(changedIndex);
        } else {
          this.data.set(changedIndex, change.doc);
        }
      }
    }
  }
}
