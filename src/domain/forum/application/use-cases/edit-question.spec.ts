import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1")
    );

    await inMemoryQuestionRepository.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: "author-1",
      content: "Conteudo teste",
      title: "Pergunta teste"
    });

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: "Conteudo teste",
      title: "Pergunta teste"
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1")
    );

    await inMemoryQuestionRepository.create(newQuestion);

    expect(() => {
      return sut.execute({
        questionId: newQuestion.id.toString(),
        authorId: "author-2",
        content: "Conteudo teste",
        title: "Pergunta teste"
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
