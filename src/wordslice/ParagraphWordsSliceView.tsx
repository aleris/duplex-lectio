import classes from './ParagraphWordsSliceView.module.scss'
import { ParagraphWordsSlice } from './BookWordSlice.ts'
import { WordSliceView } from './WordSliceView.tsx'
import { ReadViewOptions } from '../ReadView.tsx'

type Props = {
  paragraph: ParagraphWordsSlice
  options: ReadViewOptions
}

export function ParagraphWordsSliceView({ paragraph, options }: Props) {
  return <p className={classes.paragraph}>
    {paragraph.words.map((word, index) => {
      return <WordSliceView word={word} options={options} key={index} />
    })}
  </p>
}
