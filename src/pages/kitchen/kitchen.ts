import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { ClassRoomProvider } from '../../providers/class-room-provider'
import { StudentProvider } from '../../providers/student-provider'
import { ClassRoomModel } from '../../models/db-models';
import { CheckinProvider } from '../../providers/checkin-provider'

@Component({
  selector: 'page-kitchen',
  templateUrl: 'kitchen.html'
})
export class KitchenPage {

  allClassrooms: Array<ClassRoomModel> = [];
  roomMap : any;
  refresh: any;

  constructor(public navCtrl: NavController, public classroomService: ClassRoomProvider) {

  }
}
