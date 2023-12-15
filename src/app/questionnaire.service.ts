import { Injectable } from '@angular/core';
import {QuestionnaireBrief} from "./questionnaire-brief";
import {PaginatedQuestionnaires} from "./paginated-questionnaires";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  url = 'http://localhost:8080/questionnaire'
  constructor() { }

  async getQuestionnaires(): Promise<PaginatedQuestionnaires> {
    const data = await fetch(`${this.url}`);
    return await data.json() ?? [];
  }

  async getPopularQuestionnaire(): Promise<QuestionnaireBrief[]> {
    const data = await fetch(`${this.url}/popular`);
    return await data.json() ?? [];
  }
}