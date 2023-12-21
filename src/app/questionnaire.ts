import {Option} from "./option";

export interface Questionnaire {
  id: string,
  name: string,
  question: string,
  multiple: boolean,
  authorId: string,
  authorName: string,
  options: Option[]
}
