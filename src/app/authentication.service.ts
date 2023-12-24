import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, Subscription, tap} from "rxjs";
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  hasAuthenticated: boolean = false;
  authorizationHeader: {authorization: string} | undefined = undefined;

  constructor(private http: HttpClient) { }

  authenticate(): Observable<User> {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    this.authorizationHeader = {authorization: "Basic " + btoa(username + ":" + password)}

    const header = new HttpHeaders(this.authorizationHeader);
    header.append("Content-Type", "application/json");

    return this.http.post<User>("http://localhost:8080/auth/login", {headers: header})
      .pipe(
        tap(_ => this.hasAuthenticated = true),
        catchError(this.handleError<any>("login"))
      );

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.hasAuthenticated = false;
      return of(result as T);
    }
  }
}
