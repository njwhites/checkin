import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {ClassRoomModel} from '../models/db-models';

@Injectable()
export class ClassRoomProvider {

  db: any;
  remote: String;
  
  constructor() {
    console.log('Hello ClassRoomProvider Provider');
    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('classrooms');
    
    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/classrooms';
    //this.remote = 'http://localhost:5984/classrooms';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    this.db.sync(this.remote, options);
  }
  
  getAllClassRooms(){
    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true}).then(result => {
        
        let data = Array<ClassRoomModel>();
        
        result.rows.map(row => {
          let classroom = new ClassRoomModel();
          classroom._id = row.doc._id;
          classroom._rev = row.doc._rev;
          classroom.roomNumber = row.doc.roomNumber;
          classroom.students = row.doc.students;
          data.push(row.doc);
        });

        resolve(<Array<ClassRoomModel>>(data));
      }).catch(error =>{
        console.log(error);
      });
    });
  }
  
  getClassRoomByID(id: String){
    return new Promise(resolve => {

      this.db.get(id).then(doc => {
        resolve(doc);
      }).catch(err => {
        console.log(err);
        resolve(err);
      });
    });
  }
  
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
    this.db.update(classroom).catch(err => {
      console.log(err)
    });
  }
  
  addStudentToClass(classroom: ClassRoomModel, student: String){
    classroom.students.push(student);
    this.updateClassRoom(classroom);
  }
  
  removeStudentFromClass(classroom: ClassRoomModel, student: String){
    let studentIndex = -1;
    for(let i = 0; i < classroom.students.length; i++ ){
      if(student === classroom.students[i]) studentIndex = i;
    }
    if(studentIndex === -1){
      console.log("error: student not found in the class");
    } else {
      classroom.students.splice(studentIndex, 1);
      this.updateClassRoom(classroom);
    }
  }
  
  deleteClassRoom(classroom: ClassRoomModel){
    this.db.remove(classroom).catch(err => {
      console.log(err)
    });
  }
}
