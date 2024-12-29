import classes from './HomePage.module.scss'
import { BookCard, BookInfo } from './BookCard.tsx'
import { useRecentBooks } from './hooks/recentBooks.ts'
import { AppTitle } from './AppTitle.tsx'

const BOOKS: BookInfo[] = [
  {
    tag: 'easy-latin-stories-for-beginners--george-bennett',
    title: 'Easy Latin Stories for Beginners',
    author: 'George Bennet',
  },
]

const BOOKS_MAP: Map<string, BookInfo> = new Map(BOOKS.map(b => [b.tag, b]))

export function HomePage() {
  const [recentBooks] = useRecentBooks()
  if (recentBooks.list === undefined) { // fix previous model
    recentBooks.list = []
  }
  const booksExceptRecent = BOOKS.filter(b => !recentBooks.list.some(c => c.chapter.bookTag === b.tag))

  return <div className={classes.home}>
    <AppTitle />

    {0 < recentBooks.list.length
      ? <section>
          <h2>Recent Books</h2>
          <hr/>
          {recentBooks.list.map(recentBook => {
            const bookInfo = BOOKS_MAP.get(recentBook.chapter.bookTag)
            return bookInfo !== undefined
              ? <BookCard
                info={bookInfo}
                chapterIndex={recentBook.chapter.chapterIndex}
                actionText="Continue Reading"
                progress={recentBook.progress}
                key={recentBook.chapter.bookTag}
              />
              : <small>Book not found {recentBook.chapter.bookTag}</small>
          })}
          <hr/>
        </section>
      : null
    }

    {0 < booksExceptRecent.length
      ? <section>
          <h2>Other Books</h2>
          <hr/>
          {booksExceptRecent.map(b => <BookCard chapterIndex={0} info={b} actionText="Start Reading" key={b.tag}/>)}
          <hr/>
        </section>
      : null}
  </div>
}
