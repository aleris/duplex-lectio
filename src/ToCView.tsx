import { ToCItem } from '../text/src/Book.ts'
import classes from './ToCView.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useReadTracker } from './hooks/readTracker.ts'
import { ChapterRef } from './BookChapterRef.ts'
import { NavLink } from 'react-router'
import { tocRefToIndex } from './wordslice/BookWordSlice.ts'
import { ProgressView } from './ProgressView.tsx'

type Props = {
  toc: ToCItem[]
  chapterRef: ChapterRef
  onChangeContent: (ref: string) => void
  onClose: () => void
}

export function ToCView({ toc, chapterRef, onChangeContent, onClose }: Props) {
  const [isRead, , count] = useReadTracker(chapterRef)
  const total = toc.filter(c => c.display === 'link').length
  const progress = { count, total }
  return <div className={classes.toc}
              onClick={event => {
                event.stopPropagation()
              }}>
    <div className={classes.bar}>
      <div className={classes.progress}>
        {0 < progress.total
          ? <ProgressView progress={progress}/>
          : null}
      </div>
      <div className={classes.closeButton}><FontAwesomeIcon icon={faXmark} onClick={onClose}/></div>
    </div>
    <ul
      className={classes.tocList}
      role={'navigation'}>
      {toc.map((tocItem, index) => {
        function classFor(display: 'title' | 'section' | 'link') {
          switch (display) {
            case 'title':
              return classes.displayTitle
            case 'section':
              return classes.displaySection
            case 'link':
              return classes.displayLink
          }
        }

        const ref = tocItem.ref
        if (tocItem.display == 'title') {
          return <li className={classFor(tocItem.display)} key={index}>
            <span className={classes.text}>{tocItem.text}</span>
          </li>
        } else if (tocItem.display == 'link' && ref !== undefined) {
          const chapterIndex = tocRefToIndex(ref, 0)
          const chapterNumber = chapterIndex + 1
          return <li className={classFor(tocItem.display)} key={index}>
            {chapterRef.chapterIndex === chapterIndex
              ? <FontAwesomeIcon icon={faChevronRight} className={classes.currentMarker}/>
              : null
            }
            <NavLink to={`/read/${chapterRef.bookTag}/${chapterNumber}`} onClick={() => onChangeContent(ref)}>
              <span className={classes.text}>{tocItem.text}</span>
            </NavLink>
            {isRead({ ...chapterRef, chapterIndex: tocRefToIndex(ref, 0) })
              ? <FontAwesomeIcon icon={faCheck} className={classes.readMarker}/>
              : null}
          </li>
        } else {
          return <li className={classFor(tocItem.display)} key={index}>
            <span className={classes.text}>{tocItem.text}</span>
          </li>
        }
      })}
    </ul>
  </div>
}
