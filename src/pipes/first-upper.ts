import {Pipe} from '@angular/core';

@Pipe({name: 'firstUpper'})
export class FirstUpperPipe {
    transform(value: String, args?: any[]): String {

        console.log(value);
        let words = value.split(' ');
        console.log(words);
        words.forEach((word, index, array)=>{
          console.log(word);
          array[index] = word.charAt(0).toUpperCase() + word.slice(1);
          console.log(word);
        })
        console.log(words);
        let output = words.join(' ');
        console.log(output);
        return output;
    }
}
