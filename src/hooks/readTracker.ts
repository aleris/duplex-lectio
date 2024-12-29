import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from './localStorage.ts'
import { BookRef, ChapterRef } from '../BookChapterRef.ts'

export type ReadChapters = {
  readChapterIndexes: number[]
}

export type MarkRead = {
  chapterRef: ChapterRef
  read: boolean
}

export function useReadTracker(ref: BookRef): [(chapterRef: ChapterRef) => boolean, Dispatch<MarkRead>, number] {
  const [current, setCurrent] = useReadTrackerCurrentChapter()
  const [readChapterIndexes, setReadChapterIndexes] = useReadTrackerChapters(ref)

  function updateCurrentIfNeeded(ref: ChapterRef) {
    if (current?.bookTag !== ref.bookTag && current?.chapterIndex !== ref.chapterIndex) {
      setCurrent(ref)
    }
  }

  const readChapterIndexesSet = new Set(readChapterIndexes.readChapterIndexes)

  function isRead(ref: ChapterRef) {
    return readChapterIndexesSet.has(ref.chapterIndex)
  }

  function updateChapterIndexesIfNeeded(readMark: MarkRead) {
    const ref = readMark.chapterRef
    const read = readMark.read

    if (read && !isRead(ref)) {
      readChapterIndexesSet.add(ref.chapterIndex)
      const updated = Array.from(readChapterIndexesSet)
      updated.sort()
      setReadChapterIndexes({readChapterIndexes: updated})
    }

    if (!read && isRead(ref)) {
      readChapterIndexesSet.delete(ref.chapterIndex)
      const updated = Array.from(readChapterIndexesSet)
      updated.sort()
      setReadChapterIndexes({readChapterIndexes: updated})
    }
  }

  function setRead(readMark: MarkRead) {
    updateCurrentIfNeeded(readMark.chapterRef)
    updateChapterIndexesIfNeeded(readMark)
  }

  const count = readChapterIndexes.readChapterIndexes.length

  return [isRead, setRead, count]
}

export function useReadTrackerChapters(ref: BookRef): [ReadChapters, Dispatch<SetStateAction<ReadChapters | undefined>>] {
  const [readChapterIndexes, setReadChapterIndexes] = useLocalStorage<ReadChapters>(`read--${ref.bookTag}`, { readChapterIndexes: [] })
  return [ readChapterIndexes ?? { readChapterIndexes: [] }, setReadChapterIndexes ]
}

export function useReadTrackerCurrentChapter(): [ChapterRef | undefined, Dispatch<SetStateAction<ChapterRef | undefined>>] {
  return useLocalStorage<ChapterRef>('current')
}
