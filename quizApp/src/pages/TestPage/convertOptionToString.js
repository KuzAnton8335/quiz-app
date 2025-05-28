export const convertOptionToString = option => {
  // Если option уже строка - возвращаем как есть
  if (typeof option === "string") return option;

  // Если это объект - собираем все значения кроме _id в строку
  if (typeof option === "object" && option !== null) {
    let result = "";
    for (const key in option) {
      if (key !== "_id") {
        result += option[key];
      }
    }
    return result;
  }

  // На всякий случай
  return JSON.stringify(option);
};
