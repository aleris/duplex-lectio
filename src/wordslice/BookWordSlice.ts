export type BookWordSlice = {
  originalTitle: string
  title: WordSlice[]
  toc: ToCItem[]
}

type ToCItemDisplay = 'title' | 'section' | 'link'

export type ToCItem = {
  display: ToCItemDisplay
  text: string
  ref?: string
}

export function tocRefToIndex(ref: string | undefined, defaultChapterIndex: number): number {
  if (ref === undefined) {
    return defaultChapterIndex
  }
  return parseInt(ref, 10)
}

export type ChapterWordsSlice = {
  title: WordSlice[]
  paragraphs: ParagraphWordsSlice[]
}

export type ParagraphWordsSlice = {
  words: WordSlice[]
}

export type WordSlice = {
  lat: string
  eng: string | null
}
