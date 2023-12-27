import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, Subscription, tap} from "rxjs";
import {User} from "./user";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  hasAuthenticated = false;
  url = environment.backendUrl + "/auth/login";

  constructor(private http: HttpClient, private router: Router) {
    this.authenticate();
  }

  authenticate(redirect?: string) {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");

    return this.http.post<User | undefined>(this.url, {username: username, password: password}, {headers: header})
      .pipe(
        tap(_ => this.hasAuthenticated = true),
        catchError(this.handleError("auth", undefined))
      );
  }

  getHeader(): { authorization: string} {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    return {authorization: "Basic " + btoa(username + ":" + password)};
  }

  logout() {
    return this.http.post("http://localhost:8080/auth/logout", {}, {headers: this.getHeader()})
      .pipe(
        tap(_ => {
          localStorage.removeItem("username");
          localStorage.removeItem("password");

        }),
        tap(_ => {
          this.authenticate().subscribe();
        })
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.hasAuthenticated = false;
      return of(result as T);
    }
  }
}
