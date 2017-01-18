import Languages from './Languages';

const randomInteger = N => Math.floor(Math.random() * N);

export default class WordGenerator {
  constructor(languageCode) {
    this.__languageCode = languageCode;
    this.__lastUsed = Languages.getAvailable().reduce((hash, language) => Object.assign(hash, {
      [language.code]: null
    }));
  }
  next() {
    const languageCode = this.__languageCode;
    const language = Languages.getAvailable().find(({ code }) => code === languageCode);
    const words = language.words;
    const numWords = words.length;
    const lastUsedIndex = this.__lastUsed[languageCode];

    let randomIndex;
    do {
      randomIndex = randomInteger(numWords);
    } while (randomIndex === lastUsedIndex);

    this.__lastUsed[languageCode] = randomIndex;

    return words[randomIndex];
  }
}
