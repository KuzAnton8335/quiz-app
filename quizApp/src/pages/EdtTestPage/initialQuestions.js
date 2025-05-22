// Модель данных для вопросов
export const initialQuestions = [
  {
    id: 1,
    text: "Вопрос №1",
    options: [
      {
        id: 1,
        text: 'Ответ №1 "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
        isCorrect: true,
      },
      {
        id: 2,
        text: 'Ответ №2 "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
        isCorrect: false,
      },
      {
        id: 3,
        text: 'Ответ №3 "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    text: "Вопрос №2",
    options: [],
  },
];
