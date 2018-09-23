import { Directive } from '@angular/core';

/**
 * Generated class for the AutoplayVideoDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: 'video' // Attribute selector
})
export class AutoplayVideoDirective {

  constructor() {
    console.log('Hello AutoplayVideoDirective Directive');
  }

}
