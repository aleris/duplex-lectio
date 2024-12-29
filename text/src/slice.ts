import { WordSlicer } from './WordSlicer'

const wordSlicer = await WordSlicer.forTranslated('./workspace/easy_latin_stories_for_beginners__george_bennett/easy_latin_stories_for_beginners__george_bennett.translation.json')
await wordSlicer.sliceAndWriteTo('./workspace/easy-latin-stories-for-beginners--george-bennett/easy-latin-stories-for-beginners--george-bennett')
