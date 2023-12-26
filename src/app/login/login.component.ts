import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, Observable, of, tap} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  auth: AuthenticationService = inject(AuthenticationService);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  login() {
    localStorage.setItem("username", this.loginForm.value.username);
    localStorage.setItem("password", this.loginForm.value.password);
    this.auth.authenticate()
      .pipe(
        tap(_ => {
          console.log("login")
          this.router.navigateByUrl("/").then()
        }),
        catchError(this.handleError("login"))
      ).subscribe();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
