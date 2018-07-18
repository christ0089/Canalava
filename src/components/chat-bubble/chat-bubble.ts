import { Component } from '@angular/core';

/**
 * Generated class for the ChatBubbleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'chat-bubble',
  templateUrl: 'chat-bubble.html'
})
export class ChatBubbleComponent {
  msg: any = {};
  constructor() {
    this.msg = {
      content :  'Am I dreaming?',
      position : 'left',
      time : '12/3/2016',
      senderName : 'Gregory'
    }
  }
}
