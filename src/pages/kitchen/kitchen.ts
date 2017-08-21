import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { ClassRoomProvider } from '../../providers/class-room-provider'
import { StudentProvider } from '../../providers/student-provider'
import { ClassRoomModel } from '../../models/db-models';
import { CheckinProvider } from '../../providers/checkin-provider'
import { KitchenPipe } from '../../pipes/kitchen-map'

@Component({
  selector: 'page-kitchen',
  templateUrl: 'kitchen.html'
})
export class KitchenPage {

  allClassrooms: Array<ClassRoomModel> = [];
  roomMap : any;
  refresh: any;
  interval: any;
  lastData: any;
  pipe: KitchenPipe;
  timeouts: any;

  constructor( public navCtrl: NavController, public classroomService: ClassRoomProvider, public studentService: StudentProvider, public checkinService: CheckinProvider) {
    this.pipe = new KitchenPipe(checkinService, studentService, classroomService);
    this.interval = setInterval(()=>{
      console.log("intervalling")
      var piped = this.pipe.transform(this.classroomService.data);
      if(this.lastData){
        this.updateTimeouts(this.compare(this.lastData, piped));
      }
      this.lastData = piped;
    },2000);
  }

  updateTimeouts(obj: any){

    if(!this.timeouts){
      this.timeouts = {
        rooms: [],
        ids: []
      }
    }

    const end_time = new Date().getTime() + 10000;

    var temp = [];
    this.timeouts.rooms.forEach(room => {
      console.log(Number(end_time) - Number(room.end))
      if(Number(end_time) - Number(room.end) < 10000){
        temp.push(room);
      }
    })
    this.timeouts.rooms = temp;

    var temp2 = [];
    this.timeouts.ids.forEach(id => {
      console.log(Number(end_time) - Number(id.end))
      if(Number(end_time) - Number(id.end) < 10000){
        temp2.push(id);
      }
    })
    this.timeouts.ids = temp2;

    if(obj.rooms.length === 0 && obj.ids.length === 0){
      console.log(end_time, this.timeouts);
      return;
    }

    obj.rooms.forEach(room => {
      var _i = -1;
      this.timeouts.rooms.forEach((tRoom, i) =>{
        if(room === tRoom.roomNum){
          tRoom.end = end_time;
          _i = i;
        }
      })
      if(_i === -1){
        this.timeouts.rooms.push({roomNum: room, end: end_time});
      }
    });

    obj.ids.forEach(id => {
      var _i = -1;
      this.timeouts.ids.forEach((tId, i) =>{
        if(id === tId.id){
          tId.end = end_time;
          _i = i;
        }
      })
      if(_i === -1){
        this.timeouts.ids.push({id: id, end: end_time});
      }
    });


    console.log(this.timeouts);
  }

  compare(old:any , updated:any){
    var changed = {
      rooms: [],
      ids: []
    }
    updated.forEach((el, index) => {
      var comp = old[index];
      if(comp.presentCount !== el. presentCount || comp.dietCount !== el.dietCount || !this.compareArrays(comp.dietIds, el.dietIds)){
        changed.rooms.push(el.roomNum);
        var temp = el.dietIds.filter((el1) => {
          return comp.dietIds.indexOf(el1);
         });

        temp.forEach((temp1) => {
          changed.ids.push(temp1);
        })
      }
    });
    return changed;
  }  

  compareArrays(a: any, b: any){
    a = a.sort();
    b = b.sort();
    if(a.length === b.length){
      var flag = true;
      a.forEach((el,index) => {
        if(el !== b[index]){
          flag = false;
        }
      });
      return flag;
    }else{
      return false;
    }
  }

  getName(id){
    return this.studentService.data.get(id).fName + " " + this.studentService.data.get(id).lName;
  }
}
