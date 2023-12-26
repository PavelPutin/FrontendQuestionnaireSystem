import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {QuestionnaireService} from "../questionnaire.service";
import {tap} from "rxjs";

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
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  creationForm = new FormGroup({
    name: new FormControl(),
    question: new FormControl(),
    multiple: new FormControl(false),
    options: new FormArray([new FormControl("")])
  })

  submitCreation() {
    let options = [];
    // @ts-ignore
    for (let value of this.creationForm.value.options) {
      options.push({text: value})
    }
    let body = {
      name: this.creationForm.value.name,
      question: this.creationForm.value.question,
      multiple: this.creationForm.value.multiple,
      options: options
    }
    this.questionnaireService.create(body).subscribe();
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
}
