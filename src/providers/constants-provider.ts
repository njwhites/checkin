import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import {LoggingProvider} from './logging-provider';
import {UtilityProvider} from './utility-provider';

@Injectable()
export class ConstantsProvider {

  private db: any;

  constructor(public loggingService: LoggingProvider, public utilityService: UtilityProvider) {

    let credentials = utilityService.returnCredentialObject();
    if(credentials && credentials.username){
      this.db = new PouchDB('http://35.184.21.232:5984/constants', {
        ajax: {

        },
        auth: credentials
      });
    } else {
      alert('something went wrong, refresh your this web page');
    }
  }



  //method to get the rate
  returnRate(){


    //get the rate and return it
    return new Promise((resolve,reject) => {
      this.db.get('rate').then(doc=>{
        console.log(doc);
        resolve(doc);
      }).catch(err =>{
        console.log(err);
        reject(err);
      })

    })
  }

  //method to set the rate
  setRate(newRate: number): Promise<any>{
    console.log('in setRate');
    //upsert the new rate
    return new Promise((resolve, reject) =>{
      this.db.upsert('rate',(doc)=>{
        console.log('upserting');
        doc.rate = newRate;
        return doc;
      }).then(()=>{
        this.loggingService.writeLog(`Billing rate has been set to ${newRate}`);
        resolve(true);
      }).catch((err)=>{
        console.log(err);
        reject(err);
      });

    })
  }

}
