import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QuestionnaireService} from "../questionnaire.service";
import {Questionnaire} from "../questionnaire";

@Component({
  selector: 'app-questionnaire-detail',
  standalone: true,
  imports: [],
  templateUrl: './questionnaire-detail.component.html',
  styleUrl: './questionnaire-detail.component.css'
})
export class QuestionnaireDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  questionnaire: Questionnaire | undefined;

  constructor() {
    const questionnaireId = this.route.snapshot.params['id'];
    this.questionnaireService.getQuestionnaireById(questionnaireId).then(questionnaire => {
      this.questionnaire = questionnaire
    });
  }
}
