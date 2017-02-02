import {Pipe} from '@angular/core';

import {UserProvider} from '../providers/user-provider';

@Pipe({name: 'filterParents'})
export class FilterParentsPipe {

    transform(value: any, args?: any[]): Object[] {
        const userService = new UserProvider();
        const visibleStudents = userService.data.get(String(args[0])).visible_students;

        //this is the case where if they don't need a filter
        if(visibleStudents === undefined){
            return visibleStudents;
        }

        value = value.filter((entry) => {
            return visibleStudents.indexOf(entry.key) >= 0;
        })


        return value;
    }
}
