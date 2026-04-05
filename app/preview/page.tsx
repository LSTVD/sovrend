'use client'
import { useEffect, useState } from 'react'

export default function PreviewPage() {
  const [html, setHtml] = useState('')
  useEffect(() => {
    const code = sessionStorage.getItem('__sovrend_preview')
    if (code) setHtml(code)
  }, [])
  if (!html) return <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace'}}>No preview data found.</div>
  return <iframe srcDoc={html} style={{width:'100vw',height:'100vh',border:'none'}} sandbox="allow-scripts allow-same-origin" />
}
