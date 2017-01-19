import {Pipe} from '@angular/core';

@Pipe({name: 'parentReadable'})
export class ParentReadablePipe {
    transform(value: String, args?: any[]): String {

        if(value === 'checkin'){
        	return 'Check In';
        }if(value === 'signout'){
        	return 'Check Out';
        }if(value === 'napStudents'){
          return 'Nap';
        }if(value === 'presentStudents'){
          return 'Roster';
        }
        return value;
    }
}
