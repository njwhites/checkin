import {Pipe} from '@angular/core';

@Pipe({name: 'parentReadable'})
export class ParentReadablePipe {
    transform(value: String, args?: any[]): String {

        if(value === 'checkin'){
        	return 'Check In';
        }if(value === 'signout'){
        	return 'Check Out';
        }
        return value;
    }
}
