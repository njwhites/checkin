import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import PouchDB from 'pouchdb';
import 'rxjs/add/operator/map';

@Injectable()
export class UtilityProvider {


  private db: any;

  private credentials;

  constructor(public http: Http) {

    this.credentials = {};

    this.db = new PouchDB('credentials');
    // this.db = new PouchDB('constants');

    // this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/constants';

    //this.remote = 'http://localhost:5984/users';
    // let options = {
    //   live: true,
    //   retry: true,
    //   continuous: true
    // };

    // this.db.sync(this.remote, options);
  }

  returnCredentialObject(){
    return this.credentials;
  }

  getCredentials(username: string){
    return new Promise((resolve, reject)=>{
      if(username === ''){
        let thisThis = this;
        this.db.allDocs({include_docs: true}).then((docs)=>{
          if(docs.total_rows === 0){
            resolve(false);
            return;
          }
          thisThis.credentials.username = docs.rows[0].doc._id;
          thisThis.credentials.password = docs.rows[0].doc.password;
          resolve(true);
        }).catch(err=>{
          console.log(err);
          reject(false);
        })
      } else {
        this.db.get(username).then((result)=>{

          resolve(true);
        }).catch((err)=>{
          if(err.message === "missing"){
            reject(false);
          }
          console.log(err);
          reject(false);
        });
      }
    })
  }

  setCredentials(credentials){
    return new Promise((resolve,reject)=>{
      this.credentials.username = credentials.username;
      this.credentials.password = credentials.password;
      this.db.get(credentials.username).then((result)=>{
        //this should be unreachable but just incase lets update an existing user
        result.password = credentials.password;
        this.db.put(result).then((result2)=>{
          resolve(true);
        }).catch((err)=>{
          console.log(err);
          reject(err);
        })
      }).catch((err)=>{
        if(err.message === "missing"){
          let doc = {
            _id: credentials.username,
            password: credentials.password
          };
          this.db.put(doc).then((result)=>{
            resolve(true);
          }).catch((err)=>{
            console.log(err);
            reject(err);
          })
        } else {
          reject(err);
          console.log(err);
        }
      });
    })
  }
}
