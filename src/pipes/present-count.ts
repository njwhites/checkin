import {Pipe} from '@angular/core';

@Pipe({
  name: 'presentCount',
  pure: false
})
export class PresentCountPipe {
    transform(value: any, args?: any[]) {
        let count = 0;

        value.forEach((entryVal, entryKey) => {
          if(Number(entryKey) >= 0){
            if(entryVal.location != "Checked out"){
              count++;
            }
          }
        });

        return count;

    }
}
