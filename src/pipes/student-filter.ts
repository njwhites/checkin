import {Pipe} from '@angular/core';

@Pipe({name: 'studentFilter'})
export class StudentFilterPipe {
    transform(studentArr: any, args?: string): Object[] {
      return studentArr.filter((value)=>{
        let name : string = value.val.fName+" "+value.val.lName;
        return name.toLowerCase().includes(args.toLowerCase());
      })
    }
}
