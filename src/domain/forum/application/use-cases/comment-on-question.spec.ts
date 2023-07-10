import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Choose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion({
      content: 'Comentario teste'
    })

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: question.content
    });

    expect(inMemoryQuestionRepository.items[0].content).toEqual('Comentario teste');
  });
});
