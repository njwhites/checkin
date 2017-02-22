import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {UserModel} from '../models/db-models';

let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

@Injectable()
export class AuthProvider {
  hashdb: any;
  hashRemote: String;


  constructor() {

    this.hashdb = new PouchDB('hashes');
    this.hashRemote = 'https://christrogers:christrogers@christrogers.cloudant.com/authentication';
    //this.remote = 'http://localhost:5984/users';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.hashdb.sync(this.hashRemote, options);
  }

  forceInit(){

  }

  checkPassword(id: string, password:string){
    return new Promise((resolve, reject) => {
      this.hashdb.get(id).then((result) => {
        console.log("HASH: " + result);
        //what happens if there is no entry for this id?
        let salt = result.salt;
        let sha = result.sha;

        let created = this.sha256(password, salt);
        if(created.passwordHash === sha){
          //accept
          resolve(true);
        }else{
          resolve(false);
        }
      }).catch(err => {
        console.log(err);
        reject();
      });

    });
  }

  setPassword(id: string, password: string){
    return new Promise((resolve, reject) => {
      this.hashdb.upsert(id, (doc) => {
        return this.sha256(password, this.generateSALT(16));
      }).then((result) => {
        resolve();
      }).catch(err => {
        console.log(err);
        reject();
      });

    });    
  }

  //DELETE FUNCTION?

  //basically a random hex string of length
  generateSALT(length: number){
    var s = "";
    var choices = "abcdefABCDEF0123456789"
    for(var i = 0; i < length; i++){
      var index = Math.floor(Math.random()*choices.length);
      s+= choices.charAt(index);
    }
    return s;
  }

  sha256(password, salt){
    var hash = crypto.createHmac('sha256', salt).update(password);
    var value = hash.digest('hex');
    return {
      salt:salt,
      passwordHash: value
    }
  }
}
