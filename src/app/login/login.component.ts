import {Component, inject} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
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
    console.log(this.loginForm.value.username);
    console.log(this.loginForm.value.password);
    this.authenticationService.authenticate({
      username: this.loginForm.value.username ?? '', password: this.loginForm.value.password ?? ''}, () => {
      this.router.navigateByUrl("/").then(v => {console.log(v)});
    });
    return false;
  }
}
