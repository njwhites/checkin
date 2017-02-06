import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-nap-slider',
  templateUrl: 'nap-slider.html'
})
export class NapSliderPage {
  time: string = "60";
  @Input() thisStudent: any;
  @Output() napTime: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}
  
  updateNap(time){
    this.napTime.emit(time);
  }

}
