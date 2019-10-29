import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore, validateEventsArray } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';



@Pipe({
  name: 'letters',
})

export class LetterPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor() {

  }
  transform(value: string) : string {

    return value.slice(0,2);
  }


}