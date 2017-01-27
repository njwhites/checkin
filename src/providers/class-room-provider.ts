import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {ClassRoomModel} from '../models/db-models';

@Injectable()
export class ClassRoomProvider {

  db: any;
  remote: String;

  constructor() {
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

  forceInit(){
    console.log("classroom provider force init");
  }

  getAllClassRooms(){
    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true}).then(result => {

        let data = Array<ClassRoomModel>();

        result.rows.map(row => {
          data.push(<ClassRoomModel>row.doc);
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
    // this.db.update(classroom).catch(err => {
    //   console.log(err)
    // });
    this.db.upsert(classroom._id, (()=>{return classroom}));
  }

  addStudentToClass(classroom: ClassRoomModel, student: String){
    console.log(student);
    this.db.upsert(classroom._id, ((doc)=>{
      console.log(doc.students);
      doc.students.push(student);
      console.log(doc.students);
      return doc;
    }));

    // classroom.students.push(student);
    // this.updateClassRoom(classroom);
  }

  removeStudentFromClass(classroom: ClassRoomModel, SID: String){
    let studentIndex = classroom.students.indexOf(SID);
    console.log(classroom);
    console.log(studentIndex);
    if(studentIndex === -1){
      console.log("error: student not found in the class");
    } else {
      this.db.upsert(classroom._id, ((doc)=>{


    // let studentIndex = -1;
    // for(let i = 0; i < classroom.students.length; i++ ){
    //   if(SID === classroom.students[i]) studentIndex = i;
    // }
        console.log(doc.students);
        doc.students.splice(studentIndex, 1);
        console.log(doc.students);
        return doc;
      }));
      console.log(classroom.students[studentIndex]);
    }
  }

  deleteClassRoom(classroom: ClassRoomModel){
    this.db.upsert(classroom._id, ((doc)=>{
      doc._deleted = "true";
      return doc;
    }));
  }
}
