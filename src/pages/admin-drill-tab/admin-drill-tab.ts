import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public classroomService: ClassRoomProvider) {}

  ionViewDidLoad() {
  }

  cardTapped(event, room) {
    this.navCtrl.push(ListPage, {
      parentPage: 'presentStudents',
      userID: '1000',
      roomNumber: room
    })
  }

}
