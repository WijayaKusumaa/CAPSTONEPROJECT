import { splitByTerms } from '../../lib/searchTasks'

// Menyorot kata pencarian pada teks (tanpa dangerouslySetInnerHTML)
export default function Highlight({ text, terms }) {
  return splitByTerms(text, terms).map((part, index) =>
    part.match ? (
      <mark key={index} className="rounded bg-amber-200/70 px-0.5 text-inherit">
        {part.text}
      </mark>
    ) : (
      part.text
    ),
  )
}
