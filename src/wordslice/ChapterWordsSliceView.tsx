import classes from './ChapterWordsSliceView.module.scss'
import { ChapterWordsSlice } from './BookWordSlice.ts'
import { ParagraphWordsSliceView } from './ParagraphWordsSliceView.tsx'
import { ReadViewOptions } from '../ReadView.tsx'
import { WordSliceView } from './WordSliceView.tsx'

type Props = {
  chapter: ChapterWordsSlice
  options: ReadViewOptions
}

export function ChapterWordsSliceView({ chapter, options }: Props) {
  return <div className={classes.chapter}>
    <h1 className={classes.title}>
      {chapter.title.map((word, index) =>
        <WordSliceView word={word} options={options} key={index}/>
      )}
    </h1>
    {chapter.paragraphs.map((paragraph, index) => {
      return <ParagraphWordsSliceView paragraph={paragraph} options={options} key={index}/>
    })}
  </div>
}
