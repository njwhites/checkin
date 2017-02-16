import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ClassRoomProvider } from '../../providers/class-room-provider'
import { ClassRoomModel } from '../../models/db-models';
import {ListPage} from '../list/list';

/*
  Generated class for the AdminDrillTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
    console.log(this.id);
  }

  ionViewDidLoad() {
  }

  cardTapped(room, count) {
    this.navCtrl.push(ListPage, {
      parentPage: 'presentStudents',
      userID: this.id,
      roomNumber: room,
      count: count
    })
  }

}
