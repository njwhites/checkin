import {Pipe} from '@angular/core';

import {UserProvider} from '../providers/user-provider';

@Pipe({name: 'filterParents'})
export class FilterParentsPipe {
    constructor(public userService:UserProvider){}

    transform(value: any, args?: any[]): Object[] {
        const user = this.userService.data.get(String(args));
        if(user.role === this.userService.ROLES[4] || user.role === this.userService.ROLES[6]){
          const visibleStudents = this.userService.data.get(String(args)).visible_students;
          // //this is the case where if they don't need a filter
          // if(visibleStudents === undefined){
          //     return visibleStudents;
          // }

          value = value.filter((entry) => {
              return visibleStudents.indexOf(entry.key) >= 0;
          })
        }


        return value;
    }
}
