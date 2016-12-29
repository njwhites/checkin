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
    
    this.remote = 'http://localhost:5984/users';
    //this.remote = '';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };
    
    this.db.sync(this.remote, options);
  }
  
  getUsers(){
    
  }
  
  getUserByID(id: string){
    return new Promise(resolve => {
      
      this.db.get(id).then(doc => {
        console.log(doc);
        resolve(doc);
      }).catch(function (err) {
        console.log(err);
      });
    });
  }
  
  createUser(){
    
  }
  
  updateUser(){
    
  }
  
  deleteUserByID(ID){
    
  }
}
