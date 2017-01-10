import {Pipe} from '@angular/core';

//Pipe for if students have not been checked in
@Pipe({name: 'signIn'})
export class signInPipe {
  transform(value: any): Object[] {
    let returnArray = [];
    value.forEach((student) => {
      if(student.val.location === 'Checked out') {
        returnArray.push(student);
      }
    });

    return returnArray;
  }
}
