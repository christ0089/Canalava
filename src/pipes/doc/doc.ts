import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';



@Pipe({
  name: 'doc',
})

export class DocPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(private db: AngularFireDatabase) {

  }
  transform(value: any) : Observable<any> {
    console.log(value)
    return this.get(value)
  }

  get(path: string): Observable<any> {
    const path$ = this.db.object(path)
    console.log(path$.valueChanges())
    return path$.valueChanges()
  }
}