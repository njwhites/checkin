import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class UserProvider {
  
  db: any;
  remote: any;
  
  constructor() {
    console.log('Hello UserProvider Provider');
    
    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('users');
    
    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/users';
    //this.remote = 'http://localhost:5984/users';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    this.db.sync(this.remote, options);
  }
  
  getUsers(){
    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        
        let data = [];
        
        
        result.rows.map(row => {
          data[row.doc._id] = row.doc;
        });

        resolve(data);
      }).catch(error =>{
        console.log(error);
      });
    });
  }
  
  getUserByID(id: string){
    return new Promise(resolve => {
      
      this.db.get(id).then(doc => {
        resolve(doc);
      }).catch(err => {
        console.log(err);
        resolve(err);
      });
    });
  }
  
  //this will probably not be used, and if it does will need to add id collision checking
  createUserByDoc(user){
    this.db.put(user).cactch(err =>{
      console.log(err);
    })
  }
  
  //need to test if return id works, may need to be wrapped as a promise and use resolve
  //need to test if result gets the ids and
  createUserByInfo(fName: string, lName: string, phone: string, role: string){
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
        phone: phone,
        role: role
      }).catch(err=>{
        console.log(err)
      })
    
      //return the generated id so that we can let the user know their id
      return newID;
    });
  }
  
  updateUser(){
    
  }
  
  deleteUserByDoc(user){
    this.db.remove(user).catch(err => {
      console.log(err)
    });
  }
  
  deleteUserByID(ID){
    this.db.get(ID).then(doc => {
      this.db.remove(doc);
    }).catch(err => {
      console.log(err)
    });
  }
}
