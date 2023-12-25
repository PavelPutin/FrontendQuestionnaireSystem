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
  url = "http://localhost:8080/auth/login";

  constructor(private http: HttpClient, private router: Router) {
    this.authenticate();
  }

  authenticate(redirect?: string) {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");

    if (username !== null && password !== null) {
      this.http.post<User>(this.url, {username: username, password: password}, {headers: header})
        .pipe(
          tap(_ => {
            this.hasAuthenticated = true;
            this.authorizationHeader = {authorization: "Basic " + btoa(username + ":" + password)};
            if (typeof redirect !== "undefined") {
              this.router.navigateByUrl(redirect).then();
            }
          }),
          catchError(this.handleError<any>("login"))
        ).subscribe(user => this.loggedInUser = user);
    } else {
      this.hasAuthenticated = false;
    }
  }

  logout() {
    this.http.post("http://localhost:8080/auth/logout", {}, {headers: this.authorizationHeader}).subscribe(
      _ => {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.hasAuthenticated = false;
        this.router.navigateByUrl("/login").then();
      }
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
