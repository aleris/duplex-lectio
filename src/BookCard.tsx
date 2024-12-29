import { NavLink } from 'react-router'
import classes from './BookCard.module.scss'
import { Progress } from './hooks/recentBooks.ts'
import { ProgressView } from './ProgressView.tsx'
import { sitePrefix } from './site.ts'

export type BookInfo = {
  tag: string,
  title: string,
  author: string,
}

type Props = {
  info: BookInfo,
  chapterIndex: number,
  actionText: string,
  progress?: Progress
}

export function BookCard({ info, chapterIndex, actionText, progress }: Props) {
  const chapterIndexOrDefault = chapterIndex ?? 0
  const chapterNumber = chapterIndexOrDefault + 1
  return <article className={classes.bookCard}>
    <NavLink to={`/read/${info.tag}/${chapterNumber}`}>
      <img
        src={`${sitePrefix}/cover/${info.tag}.cover.png`}
        alt={`${info.tag}`}
      />
    </NavLink>
    <h3 className={classes.bookTitle} role="book-title">{info.title}</h3>
    <h4 className={classes.bookAuthor} role="book-author">{info.author}</h4>
    {progress !== undefined && progress.count !== undefined && progress.total !== undefined && 0 < progress.total
      ? <ProgressView progress={progress}/>
      : null
    }
    <NavLink to={`/read/${info.tag}/${chapterNumber}`}>{actionText}</NavLink>
  </article>
}
