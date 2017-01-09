import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-nap-buttons',
  templateUrl: 'nap-buttons.html'
})
export class NapButtonsPage {
  time: string = "60";
  @Input() thisStudent: any;
  @Output() napTime: EventEmitter<string> = new EventEmitter<string>();
  private napTimes = [
    {text: "0min", value: 0 },
    {text: "15mins", value: 15 },
    {text: "30mins", value: 30 },
    {text: "45mins", value: 45 },
    {text: "60mins", value: 60 },
  ]

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NapButtonsPage Page');
  }

  updateNap(time){
    this.napTime.emit(time);
  }

}
