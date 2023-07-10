import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentRepository {
  create(question: AnswerComment): Promise<void>;
}
