import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { UsersProvider } from '../users/users';
/*
  Generated class for the ResultsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
interface anuncio {
  "Image": string,
  "Uploader": string,
  "Message": string,
  "Timestamp": string,
  "Title" :string, 
  "Website" : string,
  "Thumbnail": string,
  "key": string,
}
@Injectable()
export class AdProvider {

  private _cars$ = new BehaviorSubject<any[]>([]); // 1
  batch = 5; // 2
  lastKey = ''; // 3
  finished = false; // 4

  constructor(public http: HttpClient, private userData: UsersProvider, public db: AngularFireDatabase) {
    this.nextPage()
      .pipe(take(1))
      .subscribe();
  }

  get anuncio$(): Observable<anuncio[]> {
    return this._cars$.asObservable();
  }

  private getContent(batch: number, lastKey: string): // 1 e 2
    Observable<anuncio[]> {
    return this.mapListKeys<anuncio>( // 3
      this.db.list<any>('/Anuncios', ref => { // 4
        const query = ref
          .orderByChild('Timestamp')
          .limitToFirst(batch);
        return (this.lastKey) // 5
          ? query.startAt(this.lastKey)
          : query;
      })
    )
  }

  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list
      .snapshotChanges()
      .map(actions =>
        actions.map(action =>
          ({ key: action.key, ...action.payload.val() })
        )
      );
  }

  nextPage(): Observable<anuncio[]> {
    if (this.finished) { return this.anuncio$; } // 1
    return this.getContent(this.batch + 1, this.lastKey) // 2
      .pipe(
        tap((movies: anuncio[]) => {
          this.lastKey = movies[movies.length - 1].key; // 3
          const newMovies = movies.slice(0, this.batch); // 4
          const currentCars = this._cars$.getValue(); // 5
          if (
            this.lastKey == newMovies[newMovies.length - 1].key
          ) { // 6
            this.finished = true;
          }
          this._cars$.next(currentCars.concat(newMovies));
        } // 7
        )
      );
  }
}