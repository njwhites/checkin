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


  db: any;
  remote: String;

  constructor(public http: Http) {
    console.log('Hello UtilityProvider Provider');

    this.db = new PouchDB('constants');

    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/constants';

    //this.remote = 'http://localhost:5984/users';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this.db.sync(this.remote, options);
  }

  getBillingRate(){
    return new Promise(resolve => {
      this.db.get("rate").then((doc) => {
        resolve(doc.rate);
      });
    })
  }

  setBillingRate(rate: number){
    this.db.upsert("rate", () => {
      return {
        rate: rate
      }
    })
  }

}
