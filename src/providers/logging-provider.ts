import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class LoggingProvider {

  private db: any;

  constructor() {

    // this.db = new PouchDB('http://104.197.130.97:5984/logging', {
    //   ajax: {
    //
    //   },
    //   auth: {
    //     username: 'chris',
    //     password: 'couchdbadmin5'
    //   }
    // });
  }

  //writes to the db a log string with a key as timestamp
  writeLog(logString: string): boolean{
    // let now = new Date();
    // let dateString = now.getFullYear()+"-"+(now.getMonth() + 1)+"-"+(now.getDate());
    //
    // this.db.upsert(dateString, (doc)=>{
    //   doc[Date.now()] = logString;
    //   return doc;
    // }).then(()=>{
    //   //success!
    //   return true;
    // }).catch((err)=>{
    //   console.log(err);
    //   //something went wrong
    //   return false;
    // })

    return false;

  }

  //return the logging data
  // loggingData():Map<string, string>{
  //   return new Map<string,string>();
  // }

  //return the logging data for a specific day
  loggingDataByDay(inputDay:Date){
    // let searchDate = inputDay.getFullYear()+"-"+(inputDay.getMonth() + 1)+"-"+(inputDay.getDate());
    // this.db.get(searchDate).then((doc)=>{
    //   return doc;
    // }).catch((err)=>{
    //   console.log(err);
    //   return {};
    // })
  }
}
