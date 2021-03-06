import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ClassRoomProvider } from '../../providers/class-room-provider'
import { ClassRoomModel } from '../../models/db-models';
import {ListPage} from '../list/list';

@Component({
  selector: 'page-admin-drill-tab',
  templateUrl: 'admin-drill-tab.html'
})
export class AdminDrillTabPage {

  allClassrooms: Array<ClassRoomModel> = [];
  roomMap : any;
  refresh: any;
  id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public classroomService: ClassRoomProvider) {
    this.id = navParams.data;
  }

  ionViewDidLoad() {
  }

  cardTapped(room, count) {
    if(count === 0){
      count = -1;
    }
    this.navCtrl.push(ListPage, {
      parentPage: 'presentStudents',
      userID: this.id,
      roomNumber: room,
      count: count
    })
  }

}
