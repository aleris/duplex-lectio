import classes from './ProgressView.module.scss'
import { Progress } from './hooks/recentBooks.ts'

type Props = {
  progress: Progress
}

export function ProgressView({ progress }: Props) {
  return <span className={classes.progress}>
    <span className={classes.readPercent}>
      {(progress.count / progress.total).toLocaleString(undefined, {
        style: 'percent',
        maximumFractionDigits: 0,
      })}
    </span>
    <span> </span>
    <span className={classes.readCount}>
      <span>({progress.count} / {progress.total})</span>
    </span>
  </span>
}
