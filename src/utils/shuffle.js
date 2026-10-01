// Fisher-Yates shuffle algorithm

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function prepareQuestionOptions(question, doShuffle = true) {
  if (!question || !question.options) return [];

  const keys = Object.keys(question.options);
  let optionList = keys.map((key) => ({
    originalKey: key,
    text: question.options[key]
  }));

  if (doShuffle) {
    optionList = shuffleArray(optionList);
  }

  const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return optionList.map((item, index) => ({
    displayLabel: labels[index] || String.fromCharCode(65 + index),
    originalKey: item.originalKey,
    text: item.text,
    isCorrect: item.originalKey === question.correct
  }));
}
