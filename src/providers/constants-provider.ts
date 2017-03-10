import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

@Injectable()
export class ConstantsProvider {

  private db: any;
  private remote: string;
  private options: any;

  constructor() {
    //setup a local db
    this.db = new PouchDB('constants');

    //the url to the remote db
    //this.remote = 'https://menteredgenciestrangtona:6577a9908eeee7e8cc07bbd350982d063fea0fe8@christrogers.cloudant.com/constants'
    this.remote = 'https://christrogers:christrogers@christrogers.cloudant.com/constants';
    // this.remote = 'http://localhost:5984/constants';
    //options for the syncing
    this.options = {
      live: true,
      retry: true,
      back_off_function: function (delay) {
        if (delay === 0){
          console.log("something failed in constants provider retrying");
        } else {
          console.log("Doing the 2000 in constants provider");
        }
        return 2000;
      }
    }

    //right now the sync is not live I'm testing with one off syncs to see if our results are better
    //on demand syncing seems to be acceptable for this constants db since they will probably be changed rarely
    //and accessed rarely
    // this.db.sync(this.remote, this.options).then(()=>{
    //   console.log('initial constants sync success');
    // }).catch((err)=>{
    //   console.log(err);
    // });
    this.sync();
  }

  //method to perform the sync between db and remote
  sync(){
      console.log('sync has been called');
      this.db.sync(this.remote, this.options)
      .on('change', function (info) {
        console.log('change');
        // handle change
      }).on('paused', function (err) {
        console.log('paused');
        // replication paused (e.g. replication up to date, user went offline)
      }).on('active', function () {
        console.log('active');
        // replicate resumed (e.g. new changes replicating, user went back online)
      }).on('denied', function (err) {
        console.log("denied:");
        console.log(err);
        // a document failed to replicate (e.g. due to permissions)
      }).on('complete', function (info) {
        console.log("sync complete\tinfo:");
        console.log(info);
        // handle complete
      }).on('error', function (err) {
        console.log("sync error");
        console.log(err);
        // handle error
      });
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
          resolve(true);
        }).catch((err)=>{
          console.log(err);
          reject(err);
        });

    })
  }

}
