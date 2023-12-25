import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

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

  authenticationService: AuthenticationService = inject(AuthenticationService);
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  login() {
    localStorage.setItem("username", this.loginForm.value.username);
    localStorage.setItem("password", this.loginForm.value.password);
    this.authenticationService.authenticate("/");
  }
}
