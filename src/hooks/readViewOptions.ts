import { Dispatch, SetStateAction } from 'react'
import { ReadViewOptions } from '../ReadView.tsx'
import { useLocalStorage } from './localStorage.ts'

const DEFAULT_READ_VIEW_OPTIONS: ReadViewOptions = { translate: false, mask: false }

export function useReadViewOptions(): [ReadViewOptions, Dispatch<SetStateAction<ReadViewOptions | undefined>>] {
  const [readViewOptions, setReadViewOptions] = useLocalStorage<ReadViewOptions>('read-view-option', DEFAULT_READ_VIEW_OPTIONS)

  return [readViewOptions ?? DEFAULT_READ_VIEW_OPTIONS, setReadViewOptions]
}
