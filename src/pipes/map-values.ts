import {Pipe} from '@angular/core';

@Pipe({name: 'mapValues'})
export class MapValuesPipe {
    transform(value: any, args?: any[]): Object[] {
        let returnArray = [];

        value.forEach((entryVal, entryKey) => {
            returnArray.push({
                key: entryKey,
                val: entryVal
            });
        });

        return returnArray;
    }
}