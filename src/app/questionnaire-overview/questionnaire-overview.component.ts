import {Component, inject} from '@angular/core';
import {PopularComponent} from "../popular/popular.component";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {QuestionnaireService} from "../questionnaire.service";
import {NgForOf} from "@angular/common";
import {PaginatedQuestionnaires} from "../paginated-questionnaires";

@Component({
  selector: 'app-questionnaire-overview',
  standalone: true,
  imports: [
    PopularComponent,
    NgForOf
  ],
  templateUrl: './questionnaire-overview.component.html',
  styleUrl: './questionnaire-overview.component.css'
})
export class QuestionnaireOverviewComponent {
  questionnaires: QuestionnaireBrief[] = [];
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  constructor() {
  }

  ngOnInit() {
    this.questionnaireService.getQuestionnaires().then((questionnaires: PaginatedQuestionnaires) => {
      this.questionnaires = questionnaires.briefDTOList;
    })
  }

  acceptFilter(questionnaireName: string, authorName: string) {

  }
}
