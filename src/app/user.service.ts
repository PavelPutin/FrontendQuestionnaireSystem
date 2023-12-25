import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {User} from "./user";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = "http://localhost:8080/user";
  authenticationService: AuthenticationService = inject(AuthenticationService);
  constructor(
    private http: HttpClient
  ) { }

  getById(uuid: string): Observable<User> {
    console.log(this.authenticationService.hasAuthenticated);
    return this.http.get<User>(`${this.url}/${uuid}`, {headers: this.authenticationService.authorizationHeader});
  }
}
