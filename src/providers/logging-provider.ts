import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class LoggingProvider {

  private db: any;

  constructor() {

    this.db = new PouchDB('http://104.197.130.97:5984/logging', {
      ajax: {

      },
      auth: {
        username: 'chris',
        password: 'couchdbadmin5'
      }
    });
  }

  //writes to the db a log string with a key as timestamp
  writeLog(logString: string): boolean{
    let now = Date.now();

    return false;
  }

  //return the logging data
  // loggingData():Map<string, string>{
  //   return new Map<string,string>();
  // }

  //return the logging data for a specific day
  loggingDataByDay(inputDay:Date):Map<string, string>{
    return new Map<string,string>();
  }
}
