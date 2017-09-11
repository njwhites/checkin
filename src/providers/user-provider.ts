import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {UserModel} from '../models/db-models';

import {LoggingProvider} from './logging-provider';
import {UtilityProvider} from './utility-provider';

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

@Injectable()
export class UserProvider {
  data: Map<String, UserModel>;
  db: any;
  remote: String;
  public ROLES = ["admin","therapist","teacher","nurse","driver","aide","bus"];
  public THERAPY_TYPES = ["OT","PT","SLP"];


  constructor(public loggingService: LoggingProvider, public utilityService: UtilityProvider) {
    this.data = new Map<String, UserModel>();
    //setup a local db and then sync it to a backend db
    this.db = new PouchDB('users');
    let credentials = utilityService.returnCredentialObject();

    if(credentials && credentials.username){

      // this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/users';
      this.remote = 'http://'+credentials.username+':'+credentials.password+'@104.197.232.119:5984/users';

      // this.remote = 'http://localhost:5984/users';
      let options = {
        live: true,
        retry: true,
        continuous: true
      };

      this.db.sync(this.remote, options).on('change', function (info) {
        // console.log('user\tchange');
        // handle change
      }).on('paused', function (err) {
        // console.log('user\tpaused');
        // replication paused (e.g. replication up to date, user went offline)
      }).on('active', function () {
        // console.log('user\tactive');
        // replicate resumed (e.g. new changes replicating, user went back online)
      }).on('denied', function (err) {
        // console.log("user\tdenied:");
        // console.log(err);
        // a document failed to replicate (e.g. due to permissions)
      }).on('complete', function (info) {
        //console.log("user\tsync complete\tinfo:");
        //console.log(info);
        // handle complete
      }).on('error', function (err) {
        //console.log("user\tsync error");
        console.log(err);
        // handle error
      });
    } else {
      alert('Something went wrong, please refresh your browser');
    }
  }

  forceInit(){
    // console.log("user provider force init");
    //tell the db what to do when it detects a change
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change => {
      this.handleChange(change);
    });
  }

  getAllUsers(){
    return new Promise((resolve, reject) =>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        this.data = new Map<String,UserModel>();
        result.rows.map(row => {
          this.data.set(row.doc._id, (row.doc));
        });
        resolve(this.data);
      }).catch(error =>{
        console.log(error);
        reject(error);
      });
    });
  }

  getBussesToData(){
    return new Promise((resolve, reject)=>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey:'9\uffff'}).then(result =>{
        this.data = new Map<String, UserModel>();
        result.rows.map(row=>{
          if(row.doc.role === this.ROLES[6]){
            this.data.set(row.doc._id, (row.doc));
          }
        });
        resolve(this.data);
      }).catch(error =>{
        console.log(error);
        reject(error);
      })
    })
  }

  getUserByID(id: String){
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

  //mainly for admin requests, we will now be able to get the user by their email field
  getUserByEmail(email: String){
    return new Promise((resolve, reject)=>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        let stuff = result.rows.filter((doc)=>{
                      if(doc.doc.email){
                        return doc.doc.email.toLowerCase() === email.toLowerCase();
                      } else {
                        return false;
                      }
                    });

        if(stuff.length > 0){
          resolve(stuff[0]);
        } else {
          reject('email not found');
        }
      }).catch(err =>{
        console.log(err);
        reject(err);
      });
    })
  }

  getTherapistTypeByID(ID: string){
    //promise for async
    ID = String(ID);
    return new Promise((resolve, reject) => {
      //get the user from the db
      this.db.get(ID).then(doc => {
        //if the therapist_type is set then it
        if(doc.therapy_type !== null && doc.therapy_type !== undefined && doc.therapy_type.length > 0){
          resolve(doc.therapy_type);
        } else {
          resolve("Not Therapist");
        }
      }).catch(err => {
        console.log(err);
        reject(err.toString);
      });
    });
  }

  createUserByDoc(user: UserModel){
    //if student._id is not -1 then the user wants to supply their own ID
    if(Number(user._id) >= 0){
      this.updateUser(user);
      this.data.set(user._id, user);

      return new Promise(resolve=>{
        resolve(user._id);
      })
    } else {

      return new Promise((resolve, reject) =>{
        let newID: String = "-1";

        //find the next available id number
        this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {

          result.rows.map(row => {
            if(Number(newID) <= Number(row.id)){
               newID = String((Number(row.id) + 1));
             }
          });

          user._id = newID;

          this.data.set(user._id, user);
          this.db.upsert(user._id,(()=>{return user})).then(() => {

            this.loggingService.writeLog(`User with id: ${user._id} has been created`);
          }).catch((err)=>{
            console.log(err);
          });


          //return the generated id so that we can let the user know their id
          resolve(newID);
        }).catch((err)=>{
          console.log(err);
          reject(err)
        });
      })
    }
  }

  updateUser(user: UserModel){
    this.db.upsert(user._id, (()=>{return user})).catch((err)=>{
      console.log(err);
    });
  }

  deleteUserByDoc(user: UserModel){
    return new Promise(resolve =>{
      this.data.delete(user._id);
      this.db.upsert(user._id, ((doc)=>{doc._deleted=true; return doc;})).then(()=>{
        this.loggingService.writeLog(`User with id: ${user._id} has been deleted`);
      }).catch((err)=>{
        console.log(err);
      });
      resolve();
    })
  }

  deleteUserByID(ID: String){
    this.db.get(ID).then(doc => {
      this.deleteUserByDoc(doc);
    }).catch(err => {
      console.log(err)
    });
  }

  getTherapistFavoriteIDs(ID: String){
    return new Promise((resolve, reject) => {
      this.db.get(ID).then(result => {
        // console.log(result);
        if(result.role.toLowerCase() === 'therapist'){
          if(!result.therapy_fav_ids){
            //add it as a field with empty []
            this.db.upsert(ID, (doc) => {
              doc.therapy_fav_ids = [];
              return doc;
            }).catch((err)=>{
              console.log(err);
            })
            resolve([]);
          }else{
            resolve(result.therapy_fav_ids);
          }

        }else{
          reject("Not therapist");
        }
      }).catch(err => {
        console.log(err);
        reject("ERRORRRRR");
      })
    })
  }

/*
* resolve(true) -> student added
* resolve(false) -> student already existed in list
* reject(false) -> failed
*/
  addTherapistFavoriteID(t_id: String, s_id: String){
    return new Promise((resolve, reject) => {

      this.getTherapistFavoriteIDs(t_id).then((result: Array<String>) => {
        if(result.indexOf(s_id) >= 0){
          resolve(false);
        }
        else{
          this.db.upsert(t_id, (doc) => {
            //theoretically should add the new student
            doc.therapy_fav_ids = [...doc.therapy_fav_ids, s_id];
            return doc;
          }).then(result => {
            this.loggingService.writeLog(`Therapist with id: ${t_id} has had student with id: ${s_id} added to their favorites`);
            resolve(true);
          }).catch(err => {
            console.log(err);
            reject(false);
          })
        }
      }).catch(err => {
        console.log(err);
        reject(false);
      });
    });
  }

  removeTherapistFavoriteID(t_id: String, s_id: String){
    return new Promise((resolve, reject) => {
      this.getTherapistFavoriteIDs(t_id).then((result: Array<String>) => {
        if(result.indexOf(s_id) >= 0){
          result.splice(result.indexOf(s_id), 1);
        }
        this.db.upsert(t_id, (doc) => {
          doc.therapy_fav_ids = result;
          return doc;
        }).then(result => {
          this.loggingService.writeLog(`Therapist with id: ${t_id} has had student with id: ${s_id} removed from their favorites`);
          resolve(true);
        }).catch(err => {
          console.log(err);
          reject(false);
        })
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  addVisibleStudent(user: UserModel, SID: String){
    this.db.upsert(user._id, (doc: UserModel)=>{
      if(!doc.visible_students){
        doc.visible_students = new Array<String>();
      }
      if(doc.visible_students.indexOf(SID) < 0){
        doc.visible_students.push(SID);
      }
      return doc;
    }).then(() => {
      this.loggingService.writeLog(`User with id: ${user._id} added student with id: ${SID} to their visible students`);
    }).catch((err)=>{
      console.log(err);
    })
  }

  removeVisibleStudent(user: UserModel, SID: String){

    let studentIndex = user.visible_students.indexOf(SID);
    if(studentIndex === -1){
      console.log("error: user not found in the class");
    } else {
      this.db.upsert(user._id, ((doc: UserModel)=>{
        doc.visible_students.splice(studentIndex, 1);
        return doc;
      })).then(()=>{
        this.loggingService.writeLog(`User with id: ${user._id} removed student with id: ${SID} from their visible students`);
      }).catch((err)=>{
        console.log(err);
      });
    }
  }

  handleChange(change){

    if(change.deleted){
      this.data.delete(change.doc._id);
    } else {
      this.data.set(change.doc._id, change.doc);
    }
  }
}
