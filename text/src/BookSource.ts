export type BookSource = {
  book: {
    title: TranslationSource
    chapters: ChapterSource[]
  }
}

export type ChapterSource = {
  title: TranslationSource,
  paragraphs: ParagraphSource[]
}

export type ParagraphSource = TranslationSource

export type TranslationSource = {
  text: string
  translation: {
    text: string
    words: [string, string][]
  }
}
