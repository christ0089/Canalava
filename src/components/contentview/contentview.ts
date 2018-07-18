import { Component } from '@angular/core';

/**
 * Generated class for the ContentviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'contentview',
  templateUrl: 'contentview.html'
})
export class ContentviewComponent {

  text: string;

  constructor() {
    console.log('Hello ContentviewComponent Component');
    this.text = 'Hello World';
  }

}
