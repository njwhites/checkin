import {Pipe} from '@angular/core';

//Pipe for if students have not been checked in
@Pipe({name: 'signOut'})
export class signOutPipe {
  transform(value: any): Object[] {
    let returnArray = [];
    //console.log(value);
    value.forEach((student) => {
      //////////////////////////////////////////////////////////////////////////
      //This is in case we allow for signing out students from nurse & therapist not just classroom
      //////////////////////////////////////////////////////////////////////////
      //if(student.val.location === 'Checked in/In classroom' || student.val.location === 'Therapist checked student out' || student.val.location === 'Nurse checked student out') {
      if(student.val.location === 'Checked in/In classroom') {
        returnArray.push(student);
      }
    });

    return returnArray;
  }
}
