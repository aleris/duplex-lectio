import { Chapter, Paragraph, Book, Translation } from './Book.ts'
import { BookWordSlice, ChapterWordsSlice, ParagraphWordsSlice, WordSlice } from '../../src/wordslice/BookWordSlice.ts'

export class WordSlicer {
  constructor(private readonly book: Book) {
  }

  public static async forTranslated(path: string): Promise<WordSlicer> {
    const json = await Bun.file(path).text()
    return new WordSlicer(JSON.parse(json) as Book)
  }

  public async sliceAndWriteTo(path: string) {
    const sliced = this.slice()
    await Bun.write(`${path}.words.book.json`, JSON.stringify({
      originalTitle: sliced.originalTitle,
      title: sliced.title,
      toc: sliced.toc
    }))
    for (let i = 0; i !== sliced.chapters.length; i++) {
      const chapter = sliced.chapters[i]
      await Bun.write(`${path}.words.chapter.${i}.json`, JSON.stringify(chapter))
    }
  }

  public slice(): BookWordSlice {
    const sliceChapter = this.sliceChapter.bind(this)
    const originalTitle = this.book.title.text.eng // TODO: how to determine if the original was lat?
    const title = this.sliceTranslation(this.book.title)
    const toc = this.book.toc
    const chapters = this.book.chapters.map(sliceChapter)
    return ({
      originalTitle,
      title,
      toc,
      chapters,
    })
  }

  public sliceChapter(chapter: Chapter): ChapterWordsSlice {
    const title = this.sliceTranslation(chapter.title)
    const sliceParagraph = this.sliceParagraph.bind(this)
    const paragraphs = chapter.paragraphs.map(sliceParagraph)
    return ({
      title,
      paragraphs,
    })
  }

  public sliceParagraph(paragraph: Paragraph): ParagraphWordsSlice {
    const words = this.sliceTranslation(paragraph)
    return ({
      words
    })
  }

  public sliceTranslation(translation: Translation): WordSlice[] {
    const REGEX_WORD = /\p{L}+/u
    const latText = translation.text.lat
    let fromIndex = -1
    let lastTranslationIndex = -1
    const translatedWords: Array<[string, string | null]> = []
    const sourceWords = translation.words
    for (let i = 0; i !== latText.length; i++) {
      if (fromIndex < i) {
        const c = latText[i]
        if (REGEX_WORD.exec(c) === null) {
          const latWord = latText.substring(fromIndex + 1, i)
          if (0 < latWord.length) {
            const { engWord, foundIndex } = this.translate(sourceWords, lastTranslationIndex, latWord)
            if (foundIndex !== -1) {
              lastTranslationIndex = foundIndex
            }
            translatedWords.push([latWord, engWord])
          }
          translatedWords.push([c, c])
          fromIndex = i
        }
      }
    }
    const latWord = latText.substring(fromIndex + 1, latText.length)
    if (0 < latWord.length) {
      const { engWord } = this.translate(sourceWords, lastTranslationIndex, latWord)
      translatedWords.push([latWord, engWord])
    }

    const merged: Array<[string, string | null]> = []
    for (let i = 0; i !== translatedWords.length; i++) {
      if (i === 0) {
        merged.push(translatedWords[i])
      } else {
        const latWord = translatedWords[i][0]
        if (REGEX_WORD.exec(latWord) === null && latWord !== ' ') {
          const prev = merged[merged.length - 1]
          prev[0] += translatedWords[i][0]
          const engWord = translatedWords[i][1]
          if (prev[1] === null) {
            prev[1] = engWord
          } else {
            prev[1] += engWord
          }
        } else {
          merged.push(translatedWords[i])
        }
      }
    }

    const words = merged
      .map(([lat, eng]) =>
        ({ lat, eng: eng })
      )
    return words
  }

  private translate(sourceWords: [string, string][], lastTranslationIndex: number, latWord: string)  {
    const foundIndex = sourceWords
      .findIndex(([translationWord], index) =>
        lastTranslationIndex < index && latWord.toLowerCase() === translationWord.toLowerCase()
      )
    let engWord: string | null
    if (foundIndex !== -1) {
      const wordTranslation = sourceWords[foundIndex][1]
      if (this.isCapitalized(latWord) && !this.isCapitalized(wordTranslation)) {
        engWord = this.capitalize(wordTranslation)
      } else {
        engWord = wordTranslation
      }
    } else {
      engWord = latWord
    }
    return {
      engWord,
      foundIndex
    }
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.substring(1)
  }

  private isCapitalized(text: string): boolean {
    const firstChar = text.charAt(0)
    return firstChar.toUpperCase() === firstChar
  }
}
