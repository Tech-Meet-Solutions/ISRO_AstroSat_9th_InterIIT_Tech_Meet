import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'https://astronetra.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient
  ) { }

  get(route: string, data?: any, blob: boolean = false): Observable<any> {
    let params = new HttpParams();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach(key => {
        params = params.set(key, data[key]);
      });
    }
    if (blob) {
      return this.http.get(baseUrl + route, {
        observe: 'response',
        responseType: 'blob' as 'json'
      });
    }
    return this.http.get(baseUrl + route, {
      responseType: 'json',
      params
    });
  }
}
