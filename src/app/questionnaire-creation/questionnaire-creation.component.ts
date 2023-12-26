import { Component } from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-questionnaire-creation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './questionnaire-creation.component.html',
  styleUrl: './questionnaire-creation.component.css'
})
export class QuestionnaireCreationComponent {
  creationForm = new FormGroup({
    title: new FormControl(), // must map to 'name'
    question: new FormControl(),
    multiple: new FormControl(),
    options: new FormArray([new FormControl("")])
  })

  submitCreation() {
    console.log(this.creationForm.value);
  }

  addOption() {
    const option: FormArray = this.creationForm.get('options') as FormArray;
    option.push(new FormControl(""))
  }

  changeOptionControl(index: number, event: Event) {
    const option: FormArray = this.creationForm.get('options') as FormArray;
    // @ts-ignore
    option.at(index).setValue(event.target.value)
  }

  getValueFor(index: number) {
    const option: FormArray = this.creationForm.get('options') as FormArray;
    return option.at(index).value;
  }

  removeOption(index: number) {
    const option: FormArray = this.creationForm.get('options') as FormArray;
    if (option.length !== 1) {
      option.removeAt(index);
    }
  }

  protected readonly FormControl = FormControl;
}
