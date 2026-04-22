// Run: node test-photos.js "your prompt here"
// Tests the photo pipeline without calling Claude or costing anything

require('dotenv').config({ path: '.env.local' })

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY
const PEXELS_KEY = process.env.PEXELS_API_KEY

async function fetchUnsplashPhotos(query, count = 6, orientation = 'landscape') {
  if (!UNSPLASH_KEY) { console.log('  ⚠ No UNSPLASH_ACCESS_KEY — skipping'); return [] }
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}&content_filter=high&order_by=relevant`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  )
  const data = await res.json()
  if (data.errors) { console.log('  ⚠ Unsplash error:', data.errors); return [] }
  return (data.results || [])
    .filter(p => p.width >= 1600)
    .map(p => ({ url: p.urls.raw + '&w=2400&q=85&fm=webp&fit=crop', w: p.width, h: p.height, desc: p.description || p.alt_description || 'no desc' }))
}

async function fetchPexelsPhotos(query, count = 6) {
  if (!PEXELS_KEY) { console.log('  ⚠ No PEXELS_API_KEY — skipping'); return [] }
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } }
  )
  const data = await res.json()
  return (data.photos || [])
    .filter(p => p.width >= 1200)
    .map(p => ({ url: p.src.original, w: p.width, h: p.height, desc: p.alt || 'no desc' }))
}

async function fetchPexelsVideo(query) {
  if (!PEXELS_KEY) return null
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3`,
    { headers: { Authorization: PEXELS_KEY } }
  )
  const data = await res.json()
  const video = (data.videos || [])[0]
  if (!video) return null
  const files = video.video_files || []
  const hd = files.find(f => f.quality === 'hd')
  return { url: (hd || files[0])?.link || '', quality: hd ? 'HD' : 'SD', duration: video.duration }
}

// Category detection (same logic as build route)
const categoryQueries = {
  coffee: 'dark coffee roastery artisan espresso moody',
  billiards: 'dark billiard hall pool table moody cinematic',
  restaurant: 'fine dining restaurant interior dark moody',
  fitness: 'dark gym athletic training cinematic',
  fashion: 'dark fashion editorial runway cinematic moody',
  beauty: 'luxury beauty spa aesthetic minimal',
  saas: 'modern minimal workspace technology clean',
  real_estate: 'luxury home interior architecture editorial',
  default: 'modern professional business',
}

function detectCategory(prompt) {
  const p = prompt.toLowerCase()
  if (p.match(/coffee|cafe|espresso|roast|brew/)) return { cat: 'coffee', q: categoryQueries.coffee }
  if (p.match(/billiard|pool.*hall|pool.*cue|cue.*stick|snooker/)) return { cat: 'billiards', q: categoryQueries.billiards }
  if (p.match(/restaurant|food|eat|dining|chef|kitchen|pizza|burger/)) return { cat: 'restaurant', q: categoryQueries.restaurant }
  if (p.match(/fitness|gym|workout|training|crossfit|yoga/)) return { cat: 'fitness', q: categoryQueries.fitness }
  if (p.match(/fashion|cloth|wear|apparel|dress|boutique|denim|jeans|selvedge/)) return { cat: 'fashion', q: categoryQueries.fashion }
  if (p.match(/beauty|skin|hair|makeup|salon/)) return { cat: 'beauty', q: categoryQueries.beauty }
  if (p.match(/saas|software|app|dashboard|platform|tech|startup/)) return { cat: 'saas', q: categoryQueries.saas }
  if (p.match(/real estate|property|house|apartment|realtor/)) return { cat: 'real_estate', q: categoryQueries.real_estate }
  // Fallback: extract meaningful words from prompt
  const stopWords = new Set(['a','an','the','and','or','for','is','it','my','i','we','our','with','that','this','of','in','to','called','brand','named','company','business','website','app','build','create','make','want','need','like','about','from','their','your','has','have','been','being'])
  const words = p.split(/[\s,.!?;:]+/).filter(w => w.length > 2 && !stopWords.has(w)).slice(0, 5)
  return { cat: 'prompt-derived', q: words.join(' ') + ' professional editorial' }
}

function detectProduct(prompt) {
  const p = prompt.toLowerCase()
  if (p.match(/billiard|pool.*cue|cue.*stick/)) return 'billiard pool cue stick dark'
  if (p.match(/watch|timepiece|horology/)) return 'luxury watch timepiece detail'
  if (p.match(/coffee|espresso|roast/)) return 'coffee bag espresso product'
  if (p.match(/jewelry|ring|necklace|diamond|gold/)) return 'luxury jewelry gold diamond'
  if (p.match(/denim|jeans|selvedge/)) return 'raw denim jeans selvedge detail'
  if (p.match(/fashion|clothing|apparel/)) return 'fashion clothing editorial studio'
  if (p.match(/shoe|sneaker|footwear/)) return 'luxury shoes footwear product'
  return null
}

async function test(prompt) {
  console.log('\n═══════════════════════════════════════')
  console.log('PROMPT:', prompt.slice(0, 80) + (prompt.length > 80 ? '...' : ''))
  console.log('═══════════════════════════════════════\n')

  const { cat, q } = detectCategory(prompt)
  const productQ = detectProduct(prompt)

  console.log(`CATEGORY: ${cat}`)
  console.log(`HERO QUERY: "${q}"`)
  console.log(`PRODUCT QUERY: ${productQ ? '"' + productQ + '"' : 'none'}\n`)

  console.log('── UNSPLASH HERO ──')
  const unsplashHero = await fetchUnsplashPhotos(q, 4)
  if (unsplashHero.length) unsplashHero.forEach((p, i) => console.log(`  ${i + 1}. ${p.w}x${p.h} — ${p.desc}`))
  else console.log('  (no results)')

  console.log('\n── PEXELS HERO (fallback) ──')
  const pexelsHero = await fetchPexelsPhotos(q, 4)
  if (pexelsHero.length) pexelsHero.forEach((p, i) => console.log(`  ${i + 1}. ${p.w}x${p.h} — ${p.desc}`))
  else console.log('  (no results)')

  if (productQ) {
    console.log('\n── UNSPLASH PRODUCT ──')
    const unsplashProd = await fetchUnsplashPhotos(productQ, 4, 'squarish')
    if (unsplashProd.length) unsplashProd.forEach((p, i) => console.log(`  ${i + 1}. ${p.w}x${p.h} — ${p.desc}`))
    else console.log('  (no results)')

    console.log('\n── PEXELS PRODUCT (fallback) ──')
    const pexelsProd = await fetchPexelsPhotos(productQ, 4)
    if (pexelsProd.length) pexelsProd.forEach((p, i) => console.log(`  ${i + 1}. ${p.w}x${p.h} — ${p.desc}`))
    else console.log('  (no results)')
  }

  console.log('\n── PEXELS VIDEO ──')
  const video = await fetchPexelsVideo(q)
  if (video) console.log(`  ${video.quality} — ${video.duration}s — ${video.url.slice(0, 80)}...`)
  else console.log('  (no video)')

  console.log('\n✓ Done. No Claude calls. No cost.\n')
}

const prompt = process.argv.slice(2).join(' ') || 'Premium Japanese denim brand called KURO. Raw selvedge jeans, $285-$450. Dark cinematic feel.'
test(prompt)
