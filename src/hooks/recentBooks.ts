import { ChapterRef } from '../BookChapterRef.ts'
import { useLocalStorage } from './localStorage.ts'

export type RecentBooks = {
  list: RecentBook[]
}

export type Progress = {
  count: number
  total: number
}
export type RecentBook = {
  chapter: ChapterRef
  progress: Progress
}

export function useRecentBooks(): [RecentBooks, (chapterRef: RecentBook) => void] {
  const [recents, setRecents] = useLocalStorage<RecentBooks>('recents', {list: []})

  const recentsWithDefault: RecentBooks = recents ?? { list: [] }

  function putRecent(recentBook: RecentBook) {
    if (recentsWithDefault.list === undefined) { // from previous model
      recentsWithDefault.list = []
    }
    const existingIndex = recentsWithDefault.list.findIndex(r =>
      r.chapter.bookTag === recentBook.chapter.bookTag && r.chapter.chapterIndex === recentBook.chapter.chapterIndex
    )
    if (existingIndex !== 0) {
      if (existingIndex !== undefined) {
        recentsWithDefault.list.splice(existingIndex, 1)
      }
      const updatedRecents: RecentBooks = { list: [recentBook, ...(recentsWithDefault.list ?? [])] }
      setRecents(updatedRecents)
    }
  }

  return [recentsWithDefault, putRecent]
}
