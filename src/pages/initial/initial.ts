import { Component } from '@angular/core';
import PouchDB from 'pouchdb';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { UtilityProvider } from '../../providers/utility-provider';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html'
})
export class InitialPage {

  private credentials = {
    username : '',
    password : ''
  }

  private db;

  private connectionStatus;

  private credentialsForm;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public utilityService: UtilityProvider) {

    utilityService.getCredentials('').then((result)=>{
      if(result){
        console.log("before");
        navCtrl.setRoot(LoginPage, {}, {});
        console.log("after");
      }
    })
    this.credentialsForm = this.formBuilder.group({
      username: [this.credentials.username,
                 Validators.compose([Validators.required])],
      password: [this.credentials.password,
                 Validators.compose([Validators.required])]
    })
  }

  ionViewDidLoad() {
    console.log('Hello InitialPage Page');
  }

  connect(){
    this.credentials.username = this.credentialsForm.controls['username'].value;
    this.credentials.password = this.credentialsForm.controls['password'].value;
    let thisThis = this;
    this.db = new PouchDB('http://104.197.130.97:5984/_users',{
      ajax: {

      },
      auth: {
        username: this.credentials.username,
        password: this.credentials.password
      },
      skip_setup: true
    });
    this.db.info().then(function (result) {
      console.log(result);
      thisThis.connectionStatus = 'success';
      thisThis.utilityService.setCredentials(thisThis.credentials);
      thisThis.navCtrl.setRoot(LoginPage, {}, {});
    }).catch(function (err) {
      console.log(err);
      thisThis.connectionStatus = 'failure';
    });
  }
}
