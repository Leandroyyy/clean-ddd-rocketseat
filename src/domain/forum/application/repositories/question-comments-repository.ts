import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentRepository {
  create(question: QuestionComment): Promise<void>;
}
