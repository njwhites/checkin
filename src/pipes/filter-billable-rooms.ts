import {Pipe} from '@angular/core';

import { ClassRoomProvider } from '../providers/class-room-provider';

@Pipe({name: 'filterBillableRooms'})
export class FilterBillablePipe {
    constructor(public classroomService:ClassRoomProvider){}

    transform(value: any, args?: any[]): Object[] {
        


        return value.filter((el) => {
          return this.classroomService.data.get(el.key + "").isBilled;
        });
    }
}
