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
      this.db.allDocs({include_docs: true}).then(result => {
        
        this.data = [];
        
        
        let docs = result.rows.map(row => {
          this.data.push(row.doc);
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
  
  createStudent(student){
    
  }
  
  updateStudent(student){
    
  }
  
  deleteStudent(student){
    
  }
  handleChange(change){
    let changedDoc = null;
    let changedIndex = null;
    
    //scan the docs for the one that has been changed
    this.data.forEach((doc, index) =>{
      if(doc._id === change.id)){
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
