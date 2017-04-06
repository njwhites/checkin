import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DriverPage} from "../driver/driver";
import {StudentProvider} from '../../providers/student-provider';
import {UserProvider} from "../../providers/user-provider";
import {UserModel} from "../../models/db-models"



@Component({
  selector: 'page-bus-select',
  templateUrl: 'bus-select.html'
})
export class BusSelectPage {
  busses: Array<UserModel> = new Array<UserModel>();

  constructor(public navCtrl: NavController,
              public studentService: StudentProvider,
              public userService: UserProvider) {
    this.userService.getBussesToData().then((result: Array<UserModel>) => {
        this.busses = result;
    });
  }

  ionViewDidLoad() {

  }

  selectBus(id){
    this.studentService.getStudentsByGroup(this.userService.data.get(String(id)).visible_students).then(result =>{
        this.navCtrl.push(DriverPage, id);
      });
  }

}
