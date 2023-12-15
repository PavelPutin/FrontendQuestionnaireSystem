import {Component, inject} from '@angular/core';
import {QuestionnaireService} from "../questionnaire.service";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-popular',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent {
  popularQuestionnaires: QuestionnaireBrief[] = [];
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  constructor() {}

  ngOnInit() {
    this.getPopularQuestionnaires();
  }

  getPopularQuestionnaires() {
    this.questionnaireService.getPopularQuestionnaire().then((popularQuestionnaires: QuestionnaireBrief[]) => {
      this.popularQuestionnaires = popularQuestionnaires;
    })
  }
}
