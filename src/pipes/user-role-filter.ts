import {Pipe} from '@angular/core';

@Pipe({name: 'userRoleFilter'})
export class UserRoleFilterPipe {
    transform(userArr: any, args?: string): Object[] {
      return userArr.filter((value)=>{
        return value.val.role===args;
      })
    }
}
