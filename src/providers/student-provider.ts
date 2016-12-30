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
          console.log(row.doc._id);
          this.data[row.doc._id] = (row.doc);
        });
        console.log(this.data);
        console.log(this.data[0]);
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
