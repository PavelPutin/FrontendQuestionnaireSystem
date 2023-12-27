import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Country} from "./country";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  url = environment.backendUrl + "/country";
  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.url)
      .pipe(
        catchError(this.handleError("get countries", []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
