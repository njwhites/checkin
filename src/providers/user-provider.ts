import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {UserModel} from '../models/db-models';

@Injectable()
export class UserProvider {
  data: Map<String, UserModel>;
  db: any;
  remote: String;
  public ROLES = ["admin","therapist","teacher","nurse","driver"];
  public THERAPY_TYPES = ["OT","PT","SLP"];


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
    //tell the db what to do when it detects a change
    this.db.changes({live: true, since: 'now', include_docs: true}).on('change', change => {
      this.handleChange(change);
    });
  }

  getAllUsers(){
    //Chris 1/27/17 this would be used to reduce the number of db calls
    // if(this.data) return Promise.resolve(this.data);

    return new Promise(resolve =>{
      this.db.allDocs({include_docs: true, startkey:'0', endkey: '9\uffff'}).then(result => {
        this.data = new Map<String,UserModel>();
        result.rows.map(row => {
          this.data.set(row.doc._id, (row.doc));
        });

        resolve(this.data);


      }).catch(error =>{
        console.log(error);
      });
    });
  }

  getUserByID(id: String){

    // Chris 1/27/17 used to reduce number of db calls
    // if(this.data) {
    //   return Promise.resolve(this.data[Number(id)]);
    // }
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
    return new Promise(resolve =>{
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
        this.db.upsert(user._id,(()=>{return user}));


        //return the generated id so that we can let the user know their id
        resolve(newID);
      });
    })
  }

  //Chris 1/27/17 this will probably not be used, refer to createUserByDoc(:UserModel)
  //Commenting out to avoid any accidental usage
  // createUserByInfo(fName: String, lName: String, phone: String, role: String){
  //   let newID: String = "-1";
  //
  //   //find the next available id number
  //   return new Promise(resolve =>{
  //     this.db.allDocs({include_docs: false, startkey:'0', endkey: '9\uffff'}).then(result => {
  //
  //       result.rows.map(row => {
  //         if(Number(newID) <= Number(row.id)){
  //            newID = String((Number(row.id) + 1));
  //          }
  //       });
  //
  //       //create an object and send it to the db
  //       let user = new UserModel();
  //       user._id = newID;
  //       user.fName = fName;
  //       user.lName = lName;
  //       user.phone = phone;
  //       user.role = role;
  //
  //       this.db.upsert(user._id, (()=>{return user}));
  //
  //       //return the generated id so that we can let the user know their id
  //       resolve(newID);
  //     });
  //   });
  // }

  updateUser(user: UserModel){
    this.db.upsert(user._id, (()=>{return user}));
  }

  deleteUserByDoc(user: UserModel){
    return new Promise(resolve =>{
      this.db.upsert(user._id, ((doc)=>{doc._deleted=true; return doc}));
      this.data.delete(user._id);
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
        console.log(result);
        if(result.role.toLowerCase() === 'therapist'){
          if(!result.therapy_fav_ids){
            //add it as a field with empty []
            this.db.upsert(ID, (doc) => {
              doc.therapy_fav_ids = [];
              return doc;
            })
            resolve([]);
          }else{
            resolve(result.therapy_fav_ids);
          }

        }else{
          reject("Not therapist");
        }
      }).catch(err => {
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
      doc.visible_students.push(SID);
      return doc;
    })
  }

  removeVisibleStudent(user: UserModel, SID: String){
    console.log(user);
    console.log(SID);
    let studentIndex = user.visible_students.indexOf(SID);
    console.log(studentIndex);
    if(studentIndex === -1){
      console.log("error: user not found in the class");
    } else {
      this.db.upsert(user._id, ((doc: UserModel)=>{
        doc.visible_students.splice(studentIndex, 1);
        return doc;
      }));
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
