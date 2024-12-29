import { useParams } from "react-router"
import { ReadView } from './ReadView.tsx'

export function ReadPage() {
  const { book } = useParams()
  if (book === undefined) {
    return <small>Book {book} not found.</small>
  }
  return <ReadView bookTag={book} />
}
