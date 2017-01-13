import {Pipe} from '@angular/core';

@Pipe({name: 'firstUpper'})
export class FirstUpperPipe {
    transform(value: String, args?: any[]): String {

        let words = value.split(' ');
        words.forEach((word, index, array)=>{
          array[index] = word.charAt(0).toUpperCase() + word.slice(1);
        })
        let output = words.join(' ');
        return output;
    }
}
