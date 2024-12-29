import { Merger } from './Merger.ts'

await Merger.mergeChapters(
  './workspace/easy_latin_stories_for_beginners__george_bennett',
  'translated_',
  './workspace/easy_latin_stories_for_beginners__george_bennett/chapters.json',
  true
)
