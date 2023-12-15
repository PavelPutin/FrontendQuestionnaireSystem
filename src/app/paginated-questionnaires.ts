import {QuestionnaireBrief} from "./questionnaire-brief";

export interface PaginatedQuestionnaires {
  briefDTOList: QuestionnaireBrief[],
  totalPages: number,
  hasNext: number,
  hasPrevious: number,
  number: number
}
