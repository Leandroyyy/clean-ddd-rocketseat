import { DeleteAnswerUseCase } from "./delete-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeQuestion } from "test/factories/make-question";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository
    );
  });

  it("should be able to choose question best answer", async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    });

    expect(inMemoryQuestionRepository.items[0].bestAnswerId ).toEqual(answer.id);
  });

  it("should not be able to choose another user question best answer", async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-1')
    })
    const answer = makeAnswer({
      questionId: question.id
    })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    expect(() => {
      return sut.execute({
        authorId: "author-2",
        answerId: answer.id.toString(),
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
