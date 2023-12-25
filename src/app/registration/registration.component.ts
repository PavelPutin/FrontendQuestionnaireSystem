import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {CountryService} from "../country.service";
import {Country} from "../country";
import {RegistrationService} from "../registration.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    age: new FormControl(1),
    gender: new FormControl(),
    maritalStatus: new FormControl(),
    country: new FormControl()
  });

  countryService: CountryService = inject(CountryService);
  countries: Country[] = [];

  constructor(
    private registrationService: RegistrationService,
    private router: Router) {
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    })
  }

  submitRegistration() {
    const registrationData = {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      age: this.registrationForm.value.age,
      gender: this.registrationForm.value.gender,
      maritalStatus: this.registrationForm.value.maritalStatus,
      country: this.registrationForm.value.country
    }
    this.registrationService.registerUser(registrationData);
    this.router.navigateByUrl("/").then();
  }
}
