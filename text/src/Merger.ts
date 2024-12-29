import { Glob } from 'bun'
import { ChapterSource, ParagraphSource, TranslationSource } from './BookSource.ts'

export class Merger {
  constructor() {
  }

  public static async mergeChapters(fromPath: string, prefix: string, toPath: string, moveFirstParagraphAsTitle: boolean) {
    const glob = new Glob(`${prefix}*`);
    const files = Array.from(glob.scanSync(fromPath)).sort()

    const chapters: ChapterSource[] = []
    for (const file of files) {
      const path = `${fromPath}/${file}`
      console.log(`Merging ${path}...`)
      const chapterJson = await Bun.file(path).text()
      const cleanedJson = chapterJson.replace('```json', '').replace('```', '')
      const chapter = JSON.parse(cleanedJson) as ChapterSource
      let title: TranslationSource
      let paragraphs: ParagraphSource[]
      if (moveFirstParagraphAsTitle) {
        title = chapter.paragraphs[0]
        paragraphs = chapter.paragraphs.slice(1)
      } else {
        title = {
          text: '',
          translation: {
            text: '',
            words: []
          }
        }
        paragraphs = chapter.paragraphs
      }
      chapters.push({
        title,
        paragraphs
      })
    }
    await Bun.write(toPath, JSON.stringify({chapters}))
  }
}
