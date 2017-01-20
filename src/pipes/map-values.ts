import {Pipe} from '@angular/core';

@Pipe({
  name: 'mapValues',
  pure: false
})
export class MapValuesPipe {
    transform(value: any, args?: any[]): Object[] {
        let returnArray = [];

        value.forEach((entryVal, entryKey) => {
          if(Number(entryKey) >= 0){
            returnArray.push({
                key: entryKey,
                val: entryVal
            });
          }
        });

        returnArray.sort((a,b)=>{
          if(a.val._id < b.val._id){
            return -1;
          } else if (a.val._id > b.val._id){
            return 1;
          }
          return 0;
        })

        return returnArray;
    }
}
