export type Book = {
  title: Translation
  toc: ToCItem[]
  chapters: Chapter[]
}

export type ToCItem = {
  display: 'title' | 'section' | 'link'
  text: string
  ref?: string
}

export type Chapter = {
  title: Translation
  paragraphs: Paragraph[]
}

export type Paragraph = Translation

export type Translation = {
  text: {
    eng: string
    lat: string
  }
  words: [string, string][]
}
