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


  /*******************************************************************************
   * updateNap
   *
   * emits the specific updated nap time
   *
    * @param time
   */
  updateNap(time){
    this.napTime.emit(time);
  }

}
