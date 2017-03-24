import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {ClassRoomModel} from '../models/db-models';
import {StudentProvider} from './student-provider';
import {LoggingProvider} from './logging-provider';


@Injectable()
export class ClassRoomProvider {

  //data is a data object to facilitate live changes
  data: Map<String, ClassRoomModel>;
  db: any;
  remote: String;
  selectedClassroom: String;

  constructor(public studentService: StudentProvider, public loggingService: LoggingProvider) {
    this.data = new Map<String,ClassRoomModel>();

    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('classrooms');



    // this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/classrooms';
    this.remote = 'http://chris:couchdbadmin5@104.197.130.97:5984/classrooms';
    // this.remote = 'http://localhost:5984/classrooms';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options).on('change', function (info) {
      console.log('classroom\tchange');
      // handle change
    }).on('paused', function (err) {
      console.log('classroom\tpaused');
      // replication paused (e.g. replication up to date, user went offline)
    }).on('active', function () {
      console.log('classroom\tactive');
      // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
      console.log("classroom\tdenied:");
      console.log(err);
      // a document failed to replicate (e.g. due to permissions)
    }).on('complete', function (info) {
      console.log("classroom\tsync complete\tinfo:");
      console.log(info);
      // handle complete
    }).on('error', function (err) {
      console.log("classroom\tsync error");
      console.log(err);
      // handle error
    });

    //tell the db wha to do when it detects a change
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change=>{
      this.handleChange(change);
    })
  }

//function originally to make sure the provider makes a connection
//I believe this might be unnecessary Chris 2/3/17
  forceInit(){
    console.log("classroom provider force init");
  }

  //this will set the data object to one classroom and return the data object
  setClassRoomByID(ID: String){
    //use a promise because db wants async functions and I prefer them over callbacks
    return new Promise(resolve=>{
      //set the data object to a new empty map
      this.data = new Map<String, ClassRoomModel>();

      //get the specified document
      this.db.get(ID).then(doc=>{
        //set the data object
        this.data.set(doc._id, doc);
        resolve(this.data);
      }).catch(error=>{
        console.log(error);
      })
    })
  }

//this will return the data object and also set the data object to be information about all classrooms
  getAllClassRooms(){
    //use promises because the db needs async and I like promises more than callbacks
    return new Promise(resolve =>{
      //set the data object to be a fresh map
      this.data = new Map<String, ClassRoomModel>();

      //get all the docs from classroom db
      this.db.allDocs({include_docs: true}).then(result => {
        //for each row in the set of rows from the result of .allDocs
        //set the doc._id and doc as key and value for the map
        result.rows.map(row => {
          this.data.set(row.doc._id, (row.doc));
        });
        //finish the promise
        resolve(this.data);
      }).catch(error =>{
        console.log(error);
      });
    });
  }


  getClassRoomByID(id: String){

    //promise for async the db requires and I like them more than callbacks
    return new Promise(resolve => {

      //get the document from classroom db corresponding to the id provided
      this.db.get(id).then(doc => {
        //return the document that corresponds
        resolve(doc);
      }).catch(err => {
        console.log(err);
        resolve(err);
      });
    });
  }
  //1/25/17 Chris: This method, get...ByRoomNumber is now effectively the same as ByID
  //I'm going to enforce that ClassRoom._id = roomNumber
  getClassRoomByRoomNumber(room: String){
    return new Promise(resolve => {
      this.db.allDocs({include_docs: true}).then(result => {

        let classroom: ClassRoomModel;
        result.rows.forEach((row) => {
          if(row.doc.roomNumber === room) classroom = row.doc;
        })
        resolve(classroom);
      }).catch(err =>{
        console.log(err)
      });
    });
  }

  updateClassRoom(classroom: ClassRoomModel){
    // use upsert because it handles timing really well
    //i.e. if a document tried to get pushed and some error occured it would retry
    this.db.upsert(classroom._id, (()=>{return classroom}));
  }

//convenience function for adding a student to the classroom document
//prevents the other parts of the code from having to do more work
//classroom needs to be the document for the classroom to be modified and student is just the student id
  addStudentToClass(classroom: ClassRoomModel, student: String){
    //upsert>push
    //upsert takes a document id and a function that should return a document
    //this function is how the document should be modified
    //so the returned doc is what will be put in the db as the document corresponding to the input id
    this.db.upsert(classroom._id, ((doc)=>{
      if(doc.students.indexOf(student) < 0){
        doc.students.push(student);
      }
      return doc;
    })).then(() => {
      this.loggingService.writeLog(`Student with id: ${student} has been added to room ${classroom.roomNumber}`);
    });

    // classroom.students.push(student);
    // this.updateClassRoom(classroom);
  }

  //convenience function for removing a student, similar and opposite to addStudent
  removeStudentFromClass(classroom: ClassRoomModel, SID: String){
    // find the array location of the input student in the classrooms array of students
    let studentIndex = classroom.students.indexOf(SID);
    //if it wasn't found don't do anything and tell the user
    if(studentIndex === -1){
      console.log("error: student not found in the class");
    } else {
      //upsert with the specified student spliced out of the array
      this.db.upsert(classroom._id, ((doc)=>{
        doc.students.splice(studentIndex, 1);
        return doc;
      })).then(() => {
        this.loggingService.writeLog(`Student with id: ${SID} has been removed from room ${classroom.roomNumber}`);
      });
    }
  }

  removeStudent(SID: String){
    //go through each classroom
    this.data.forEach(value=>{
      //if that classroom has the student in their array remove them
      if(value.students.find(student=>{ return student === SID})){
        this.removeStudentFromClass(value,SID);
      }
    })
  }

  //same Idea as addStudent but instead its a classroom aide
  addAideToClass(classroom: ClassRoomModel, aide: string){
    this.db.upsert(classroom._id, ((doc)=>{
      //safety thing so that the code doesn't break if the document somehow doesn't have an aide array
      if(doc.aides === undefined){
        doc.aides = new Array<string>();
      }
      if(doc.aides.indexOf(aide) < 0 ){
        doc.aides.push(aide);
      }
      return doc;
    })).then(() => {
      this.loggingService.writeLog(`Aide: ${aide} has been added to room ${classroom.roomNumber}`);
    });
    classroom.aides.push(aide);
    this.data.set(classroom._id,classroom);
  }

  //same idea as remove student but for classroom aides instead
  removeAideFromClass(classroom: ClassRoomModel, userID: string){
    //find the specified aides array location
    let userIndex = classroom.aides.indexOf(userID);

    //if they aren't found don't do anything but tell the user they weren't found
    if(userIndex === -1){
      console.log("error: user not found in the class");
    } else {
      //upsert the new doc where we splice out the specified aide
      this.db.upsert(classroom._id, ((doc)=>{
        doc.aides.splice(userIndex, 1);
        return doc;
      })).then(() => {  
        this.loggingService.writeLog(`Aide: ${userID} has been added to room ${classroom.roomNumber}`);
      });
    }
  }

  removeAide(UID: string){
    //go through each classroom
    this.data.forEach(value=>{
      //if that classroom has the user in their array remove them
      if(value.aides){
        if(value.aides.find(aide=>{ return aide === UID})){
          this.removeAideFromClass(value,UID);
        }
      }
    })
  }

//function to delete a classroom from the db
//requires the classroom document
  deleteClassRoom(classroom: ClassRoomModel){
    //setting the doc._deleted field to true is the same as deleting it as far as couch and pouch are concerned
    this.db.upsert(classroom._id, ((doc)=>{
      doc._deleted = true;
      return doc;
    }));

    //make sure the dataobject is immediately up to date on the deleted classroom
    this.data.delete(classroom._id);

  }

  //function for adding new classrooms
  createClassroom(classroom: ClassRoomModel){
    //update performs the same function as add
    this.updateClassRoom(classroom);

    //add it to the data object for timing purposes
    this.data.set(classroom._id, classroom);

    return new Promise(resolve=>{
      resolve(classroom._id);
    })
  }

  //function for what to do when the db detects a change
  handleChange(change){
    if(this.data === undefined){
      this.data = new Map<String,ClassRoomModel>();
    }
    //if the change is a delete, delete it from the data object
    if(change.deleted){
      this.data.delete(change.doc._id);

    }
    //otherwise its an update or an add which are both treated the same
    else {
      //double check this !!!!!!
      if(this.selectedClassroom === change.doc._id){
        this.studentService.getStudentsByGroup(change.doc.students);
      }

      this.data.set(change.doc._id, change.doc);
    }
  }

  areTheseEqual(array1: Array<any>, array2: Array<any>){


    return false;
  }
}
