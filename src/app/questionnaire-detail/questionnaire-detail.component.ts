import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {QuestionnaireService} from "../questionnaire.service";
import {Questionnaire} from "../questionnaire";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-questionnaire-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './questionnaire-detail.component.html',
  styleUrl: './questionnaire-detail.component.css'
})
export class QuestionnaireDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  questionnaire: Questionnaire | undefined;
  hasAnswered: boolean | undefined;
  optionsFormGroup: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  questionnaireId: string;

  constructor() {
    this.questionnaireId = this.route.snapshot.params['id'];
    this.questionnaireService.getQuestionnaireById(this.questionnaireId).then(questionnaire => {
      this.questionnaire = questionnaire;
    });
    this.questionnaireService.getHasUserAnsweredByQuestionnaireId(this.questionnaireId).then(result => {
      this.hasAnswered = result.result;
    });
    this.optionsFormGroup = this.formBuilder.group({
      options: this.formBuilder.array([])
    });
  }

  submitVote() {
    const selected: string[] = this.optionsFormGroup.value.options;
    this.questionnaireService.vote(this.questionnaireId, selected);
  }

  controlOnChange(e: Event) {
    const options: FormArray = this.optionsFormGroup.get('options') as FormArray;
    // @ts-ignore
    if (e.target.checked) {
      // @ts-ignore
      options.push(new FormControl(e.target.value));
    } else {
      // @ts-ignore
      const index = options.controls.findIndex(option => option.value === e.target.value);
      options.removeAt(index);
    }
  }
}
