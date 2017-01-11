import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {UserModel} from '../models/db-models';

@Injectable()
export class UserProvider {
  data: Array<UserModel>;
  db: any;
  remote: String;

  constructor() {
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

  forceInit(){
    console.log("user provider force init");
  }

  getAllUsers(){
    if(this.data) return Promise.resolve(this.data);

    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {

        result.rows.map(row => {
          this.data[row.doc._id] = row.doc;
        });

        resolve(this.data);
      }).catch(error =>{
        console.log(error);
      });
    });
  }

  getUserByID(id: String){
    if(this.data) {
      return Promise.resolve(this.data[Number(id)]);
    }
    return new Promise(resolve => {

      this.db.get(id).then(doc => {
        resolve(doc);
      }).catch(err => {
        console.log(err);
        let errMessage = new UserModel();
        errMessage._id = "missing";
        resolve(errMessage);
      });
    });
  }

  //this will probably not be used, and if it does will need to add id collision checking
  createUserByDoc(user: UserModel){
    this.db.put(user).catch(err =>{
      console.log(err);
    })
  }

  //need to test if return id works, may need to be wrapped as a promise and use resolve
  //need to test if result gets the ids and
  createUserByInfo(fName: String, lName: String, phone: String, role: String){
    let newID: String = "-1";

    //find the next available id number
    this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {

      result.rows.map(row => {
        if(Number(newID) <= Number(row._id)){
           newID = String((Number(row._id) + 1));
         }
      });

      //create an object and send it to the db
      let user = new UserModel();
      user._id = newID;
      user.fName = fName;
      user.lName = lName;
      user.phone = phone;
      user.role = role;

      this.db.put(user).catch(err=>{
        console.log(err)
      })

      //return the generated id so that we can let the user know their id
      return newID;
    });
  }

  updateUser(user: UserModel){
    this.db.upsert(user._id, (()=>{return user}));
  }

  deleteUserByDoc(user: UserModel){
    this.db.remove(user).catch(err => {
      console.log(err)
    });
  }

  deleteUserByID(ID: String){
    this.db.get(ID).then(doc => {
      this.db.remove(doc);
    }).catch(err => {
      console.log(err)
    });
  }
}
