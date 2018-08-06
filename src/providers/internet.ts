import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the InternetProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class InternetProvider {

  constructor(public http: HttpClient) {
    console.log('Hello InternetProvider Provider');
  }
  networkConnected: any;

  current_page: any;

  setRootPage() {
    this.current_page = 'TabsPage'
  } 

}
