import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class ClassRoomProvider {

  db: any;
  remote: any;
  
  constructor() {
    console.log('Hello ClassRoomProvider Provider');
    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('classrooms');
    
    this.remote = 'http://localhost:5984/classrooms';
    //this.remote = '';
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
        
        let data = [];
        
        
        let docs = result.rows.map(row => {
          data.push(row.doc);
        });

        resolve(data);
      }).catch(error =>{
        console.log(error);
      });
    });
  }
  
  getClassRoomByID(id: string){
    return new Promise(resolve => {

      this.db.get(id).then(doc => {
        resolve(doc);
      }).catch(err => {
        console.log(err);
        resolve(err);
      });
    });
  }
  
  getClassRoomByRoomNumber(room: string){
    return new Promise(resolve => {
      this.db.allDocs({include_docs: true}).then(result => {
        
        let classroom: any;
        result.rows.map(row => {
          if(row.doc.roomNumber === room) classroom = row.doc;
        });
        resolve(classroom);
      }).catch(err =>{
        console.log(err)
      });
    });
  }
  
  updateClassRoom(classroom){
    this.db.update(classroom).catch(err => {
      console.log(err)
    });
  }
  
  addStudentToClass(classroom, student: string){
    classroom.students.push(student);
    this.updateClassRoom(classroom);
  }
  
  removeStudentFromClass(classroom, student: string){
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
  
  deleteClassRoom(classroom){
    this.db.remove(classroom).catch(err => {
      console.log(err)
    });
  }
}
