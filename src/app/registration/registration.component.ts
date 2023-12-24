import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {CountryService} from "../country.service";
import {Country} from "../country";

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

  constructor() {}

  ngOnInit() {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    })
  }
}
