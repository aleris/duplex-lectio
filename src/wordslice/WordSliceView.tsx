import classes from './WordSliceView.module.scss'
import { WordSlice } from './BookWordSlice.ts'
import { ReadViewOptions } from '../ReadView.tsx'

type Props = {
  word: WordSlice
  options: ReadViewOptions
}

export function WordSliceView({ word, options }: Props) {
  return <span className={classes.word}>
    <span className={classes.text}>{word.lat === ' ' ? <>&nbsp;</> : word.lat}</span>
    {options.translate
      ? <span className={`${classes.translation} ${options.mask ? classes.hide : ''}`}>{word.eng ?? ''}</span>
      : null}
  </span>
}
