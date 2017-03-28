import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import PouchDB from 'pouchdb';
import 'rxjs/add/operator/map';

/*
  Generated class for the UtilityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilityProvider {


  private db: any;

  private credentials;

  constructor(public http: Http) {
    console.log('Hello UtilityProvider Provider');

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


  getCredentials(username: string){
    return new Promise((resolve, reject)=>{
      if(username === ''){
        let thisThis = this;
        this.db.allDocs({include_docs: true}).then((docs)=>{
          console.log(docs);
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
          console.log('user exists');
          console.log(result);
          resolve(true);
        }).catch((err)=>{
          if(err.message === "missing"){
            console.log("that guy don't work here buddy");
            reject(false);
          }
          console.log(err);
          reject(false);
        });
      }
    })
  }

  setCredentials(credentials){
    // this.db.get(credentials.username).then((result)=>{
    //   console.log('gotem');
    //
    // }).catch((err)=>{
    //   if(err.message === "missing"){
    //     console.log("that guy don't work here buddy2");
    //     // let doc = {
    //     //   _id: credentials.username,
    //     //   password: credentials.password
    //     // };
    //     // this.db.put(doc).then((result)=>{
    //     //   console.log(result);
    //     // }).catch((err)=>{
    //     //   console.log(err)
    //     // });
    //   }
    //   console.log(err);
    // }
    this.credentials.username = credentials.username;
    this.credentials.password = credentials.password;
    this.db.get(credentials.username).then((result)=>{
      console.log('user exists');
      console.log(result);
    }).catch((err)=>{
      if(err.message === "missing"){
        console.log("that guy don't work here buddy2");
        let doc = {
          _id: credentials.username,
          password: credentials.password
        };
        this.db.put(doc).then((result)=>{
          console.log(result);
        }).catch((err)=>{
          console.log(err);
        })
      }
      console.log(err);
    });
  }
}
