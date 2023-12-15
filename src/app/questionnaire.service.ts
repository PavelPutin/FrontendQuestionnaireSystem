import { Injectable } from '@angular/core';
import {QuestionnaireBrief} from "./questionnaire-brief";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  url = 'http://localhost:8080/questionnaire'
  constructor() { }

  async getPopularQuestionnaire(): Promise<QuestionnaireBrief[]> {
    const data = await fetch(`${this.url}/popular`);
    return await data.json() ?? [];
  }
}
