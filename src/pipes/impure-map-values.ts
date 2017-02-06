import {Pipe} from '@angular/core';

@Pipe({
  name: 'impureMapValues',
  pure: false
})
export class ImpureMapValuesPipe {
    transform(value: any, args?: any[]): Object[] {
        let returnArray = [];


        value.forEach((entryVal, entryKey) => {
          //if args[0] is true we want all the entries, if its false we only want the positive number id's for entries
          if(Number(entryKey) >= 0 || args){
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
