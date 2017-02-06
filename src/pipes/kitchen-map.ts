import {Pipe} from '@angular/core';

import {CheckinProvider} from '../providers/checkin-provider';
import {StudentProvider} from '../providers/student-provider';
import {ClassRoomProvider} from '../providers/class-room-provider';

import {ClassRoomModel} from '../models/db-models'

@Pipe(
{
    name: 'kitchenPipe',
    pure: false
})
export class KitchenPipe {
    checkinService: any;
    studentService: any;
    classroomService: any;
    constructor(checkinService: CheckinProvider, studentService: StudentProvider, classroomService: ClassRoomProvider){
        this.checkinService = checkinService;
        this.studentService = studentService;
        this.classroomService = classroomService;
    }

    transform(value: any, args?: any[]): Object[] {
        var out = [];
        value.forEach(((classroom:ClassRoomModel, key) => {
            if(classroom.roomNumber.toLowerCase() !== 'unallocated'){
                let present = classroom.students.filter(id => {      
                  return this.studentService.data.get(id).location !== this.checkinService.CHECKED_OUT;
                });
                let diet = present.filter(id => {
                  return this.studentService.data.get(id).dietNeed !== undefined && this.studentService.data.get(id).dietNeed === true;
                })
                //console.log(`Normies: ${present.length - diet.length} Others: ${diet.length}`);
                out.push({
                    roomNum: key,
                    presentCount: present.length,
                    dietCount: diet.length
                });
            }
        }));
        //const visibleStudents = userService.data.get(String(args[0])).visible_students;

        // //this is the case where if they don't need a filter
        // if(visibleStudents === undefined){
        //     return visibleStudents;
        // }

        // value = value.filter((entry) => {
        //     return visibleStudents.indexOf(entry.key) >= 0;
        // })

        //console.log(out);
        return out;
    }
}
