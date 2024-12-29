import { ChapterWordsSliceView } from './wordslice/ChapterWordsSliceView.tsx'
import { ReadToolbarView } from './ReadToolbarView.tsx'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BookWordSlice, ChapterWordsSlice, tocRefToIndex } from './wordslice/BookWordSlice.ts'
import { ToCView } from './ToCView.tsx'
import { Button } from './components/Button.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useReadTracker } from './hooks/readTracker.ts'
import { BookRef, ChapterRef } from './BookChapterRef.ts'
import { useReadViewOptions } from './hooks/readViewOptions.ts'
import { useRecentBooks } from './hooks/recentBooks.ts'
import classes from './ReadView.module.scss'

export type ReadViewOptions = {
  translate: boolean
  mask: boolean
}

type Props = {
  bookTag: string
}

export function ReadView({ bookTag }: Props) {
  const [book, setBook] = useState<BookWordSlice | undefined>(undefined)

  useEffect(() => {
    import(`./assets/text/${bookTag}.words.book.json`)
      .then((res) => {
        setBook(res.default)
      })
      .catch(e => {
        console.error(`unable to load book bookTag=${bookTag}`, e)
      })
  }, [bookTag])

  const [chapter, setChapter] = useState<ChapterWordsSlice | undefined>(undefined)
  const [, putRecent] = useRecentBooks()

  const [readViewOptions, setReadViewOptions] = useReadViewOptions()
  const [showToC, setShowToC] = useState<boolean>(false)
  const { chapter: chapterParam } = useParams()

  function parseParamChapterNumber(chapterParam: string | undefined, defaultChapterNumber: number): number {
    return parseInt(chapterParam ?? `${defaultChapterNumber}`, 10)
  }

  const chapterNumber = parseParamChapterNumber(chapterParam, 1)
  const chapterIndex = chapterNumber - 1

  useEffect(() => {
    import(`./assets/text/${bookTag}.words.chapter.${chapterIndex}.json`)
      .then((res) => {
        setChapter(res.default)
      })
      .catch(e => {
        console.error(`unable to load chapter bookTag=${bookTag} chapterIndex=${chapterIndex}`, e)
      })
  }, [bookTag, chapterIndex])

  const navigate = useNavigate()

  const bookRef: BookRef = useMemo(() => ({
    bookTag,
  }), [bookTag])

  const chapterRef: ChapterRef = useMemo(() => ({
    ...bookRef,
    chapterIndex: chapterIndex,
    chapterTitle: chapter?.title.map(w => w.eng ?? '').join('') ?? '',
  }), [bookRef, chapterIndex, chapter?.title])

  const [isRead, setRead, count] = useReadTracker(bookRef)

  useEffect(() => {
    putRecent({chapter: chapterRef, progress: {count, total: book?.toc.length ?? 0}})
  }, [chapterRef, putRecent, book, count])

  if (book === undefined || chapter === undefined) {
    return <article className={classes.readCanvas}>
      <div className={classes.paper}>
        <small>Loading...</small>
      </div>
    </article>
  }

  function handleOnChangeContent(ref: string) {
    const chapterIndex = tocRefToIndex(ref, 0)
    const chapterNumber = chapterIndex + 1
    navigate(`/read/${bookTag}/${chapterNumber}`, {})
    setShowToC(false)
    window.scrollTo(0, 0)
  }

  function handleOnMarkAsReadClick() {
    setRead({ chapterRef, read: true })

    book?.toc.map((tocItem) => tocItem.ref)
    if (chapterNumber < (book?.toc?.length ?? 0)) {
      navigate(`/read/${bookTag}/${chapterNumber + 1}`)
      window.scrollTo(0, 0)
    }
  }

  function handleOnMarkAsUnReadClick(event: React.MouseEvent) {
    event.preventDefault()
    setRead({ chapterRef, read: false })
    navigate(`/read/${bookTag}/${chapterNumber}`)
    window.scrollTo(0, 0)
  }

  function handleReadCanvasOnClick() {
    if (showToC) {
      setShowToC(false)
    }
  }

  function asInert(isInert: boolean) {
    if (!isInert) {
      return { inert: '' }
    } else {
      return {}
    }
  }

  return <article className={classes.read} onClick={handleReadCanvasOnClick}>
    <div className={`${classes.canvas} ${showToC ? classes.shaded : ''}`}>
      <div className={classes.paper}>
        <ChapterWordsSliceView chapter={chapter} options={readViewOptions}/>
      </div>
      <div className={classes.markRead}>
        <div className={classes.bookmark}><FontAwesomeIcon icon={faBookmark}/></div>
        {isRead(chapterRef)
          ? <p>
              You have read this chapter,
              however, you can <a href="#" role="button" onClick={handleOnMarkAsUnReadClick}>mark it back as unread</a> if
              you wish.
            </p>
          : <>
              <p>When ready, mark this chapter as read to go to the next one.</p>
              <Button
                text="Mark as Read"
                icon={<FontAwesomeIcon icon={faCheck}/>}
                title="Mark as read and go to next"
                onClick={handleOnMarkAsReadClick}
              />
            </>}
      </div>
    </div>
    <div className={`${classes.toc} ${showToC ? classes.shown : classes.hidden}`} {...asInert(showToC)}>
      <ToCView
        toc={book.toc}
        chapterRef={chapterRef}
        onChangeContent={handleOnChangeContent}
        onClose={() => setShowToC(false)}
      />
    </div>
    <ReadToolbarView
      onExit={() => navigate(`/`)}
      onClickShowToC={() => setShowToC(!showToC)}
      options={readViewOptions}
      onOptionsChange={setReadViewOptions}
    />
  </article>
}
