import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    // Default fallback values
    const defaultTitle = 'Statlyx | Football Scouting & Intelligence Platform'
    const defaultDesc = 'Track and analyze 2,839+ professional football players across Europe\'s Top 5 leagues with interactive radar profiles and similarity analytics.'

    // Update document title
    document.title = title ? `${title} | Statlyx` : defaultTitle

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDesc)
    }

    // Update Open Graph title & description
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | Statlyx` : defaultTitle)
    }

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) {
      ogDesc.setAttribute('content', description || defaultDesc)
    }
  }, [title, description])

  return null
}
