import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, Subscription, tap} from "rxjs";
import {User} from "./user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  hasAuthenticated: boolean = false;
  loggedInUser: User | undefined;
  authorizationHeader: {authorization: string} | undefined = undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.authenticate();
  }

  authenticate() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    this.authorizationHeader = {authorization: "Basic " + btoa(username + ":" + password)}

    const header = new HttpHeaders(this.authorizationHeader);
    header.append("Content-Type", "application/json");

    this.http.post<User>("http://localhost:8080/auth/login", {username: username, password: password}, {headers: header})
      .pipe(
        tap(_ => this.hasAuthenticated = true),
        catchError(this.handleError<any>("login"))
      ).subscribe(user => this.loggedInUser = user);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.hasAuthenticated = false;
      return of(result as T);
    }
  }
}
