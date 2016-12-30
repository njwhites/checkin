import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';


@Injectable()
export class StudentProvider {
  data: any;
  db: any;
  remote: any;

  constructor() {
    console.log('Hello StudentProvider Provider');
    
    
    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('students');
    
    this.remote = 'http://localhost:5984/students';
    //this.remote = '';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    this.db.sync(this.remote, options);
  }
  
  getStudents(){
    //if this provider already has the data, just return it
    //future changes to db will be auto synchronized
    if(this.data){
      return Promise.resolve(this.data);
    }
    
    //otherwise we should do an initial gathering of docs
    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        
        //this.data: any[] = new Array(result.;
        this.data = [];
        let docs = result.rows.map(row => {
          this.data[row.doc._id] = (row.doc);
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
  
  //do this if students gets large enough that we don't want every classroom to pull all student information
  getStudentsByGroup(students: string[]){
    
  }
  
  //work in progress, development tabled until use case arises
  getStudentByFullName(name){
    let found = false;
    
    for(let row of this.data){
      if(row.fName+" "+row.lName === name){
        found = true;
        return Promise.resolve(row);
      }
    }
    
    if(!found){}
  }
  
  createStudent(student){
    this.db.post(student);
  }
  
  createStudentByInfo(fName: string, lName: string, loc: string, note: string, icon: string){
    let newID: string = "-1";
    
    //find the next available id number
    this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {
    
      result.rows.map(row => {
        if(Number(newID) <= Number(row._id)) newID = String((Number(row._id) + 1));
      });
    
      //create an object and send it to the db
      this.db.put({
        _id: newID,
        fName: fName,
        lName: lName,
        "location": loc,
        note: note,
        icon: icon
      }).catch(err=>{
        console.log(err)
      })
    
      //return the generated id so that we can let the student know their id, may not be needed
      return newID;
    });
  }
  
  updateStudent(student){
    this.db.put(student).catch(err => {
      console.log(err);
    });
  }
  
  updateStudents(students){
    for(let student in students){
      this.updateStudent(student);
    }
    
    /* or maybe
    this.db.bulkDocs(students).catch(err => {
      console.log(err);
    });
    */
  }
  
  deleteStudent(student){
    this.db.remove(student).catch(err => {
      console.log(err);
    });
  }
  
  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;
    
    //scan the docs for the one that has been changed
    this.data.forEach((doc, index) =>{
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
    });
    
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    } else {
      
      //if changedDoc is set then it must be an update
      if(changedDoc){
        this.data[changedIndex] = change.doc;
      } else {
        this.data.push(change.doc);
      }
    }
  }
}
