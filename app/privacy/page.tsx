'use client'
import Link from 'next/link'

const UI = "'Orbitron',sans-serif"

export default function PrivacyPage() {
  return <main className="min-h-screen" style={{background:'#000308',color:'#F0F0FF'}}>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/" style={{fontFamily:UI,fontSize:9,letterSpacing:'.2em',color:'rgba(0,229,255,.5)',textDecoration:'none',display:'inline-block',marginBottom:32}}>← SOVREND</Link>
      <h1 style={{fontFamily:UI,fontSize:24,fontWeight:700,letterSpacing:'.08em',marginBottom:8}}>Privacy Policy</h1>
      <p style={{fontSize:12,color:'rgba(195,200,215,.45)',marginBottom:40}}>Last updated: March 26, 2026</p>

      <div style={{fontSize:14,lineHeight:1.9,color:'rgba(195,200,215,.75)'}}>
        <Section title="1. Information We Collect">
          <p>When you use SOVREND, we collect information you provide directly:</p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Account information (email address, password)</li>
            <li>App prompts and descriptions you submit for building</li>
            <li>Generated application code and metadata</li>
            <li>Usage data (build count, feature usage)</li>
          </ul>
          <p>We automatically collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Device and browser information</li>
            <li>IP address and approximate location</li>
            <li>Pages visited and actions taken within the platform</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-6">
            <li>To provide, maintain, and improve SOVREND</li>
            <li>To process your app-building requests through AI providers</li>
            <li>To manage your account and enforce usage limits</li>
            <li>To send service-related communications</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </Section>

        <Section title="3. AI Processing">
          <p>Your prompts are sent to third-party AI providers (Anthropic, Google) to generate application code. These providers process your input according to their own privacy policies. We do not use your prompts to train AI models. Generated code is stored in your account and belongs to you.</p>
        </Section>

        <Section title="4. Data Sharing">
          <p>We do not sell your personal information. We share data only with:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><b style={{color:'#F0F0FF'}}>Service providers</b> — Supabase (database), Vercel (hosting), Stripe (payments), Anthropic and Google (AI processing)</li>
            <li><b style={{color:'#F0F0FF'}}>Legal requirements</b> — When required by law or to protect our rights</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>We use industry-standard security measures including encryption in transit (TLS), encrypted database storage, and row-level security policies. No system is 100% secure, and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>You may request to access, correct, or delete your personal data by contacting us at hello@sovrend.com. You can delete your account at any time, which will remove your stored apps and data.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>
        </Section>

        <Section title="8. Children">
          <p>SOVREND is not intended for users under 13. We do not knowingly collect information from children under 13.</p>
        </Section>

        <Section title="9. Changes">
          <p>We may update this policy. Material changes will be communicated via email or in-app notice.</p>
        </Section>

        <Section title="10. Contact">
          <p>Questions about this policy: <a href="mailto:hello@sovrend.com" style={{color:'#00E5FF'}}>hello@sovrend.com</a></p>
          <p className="mt-2">SOVREND, Inc.<br/>A Delaware C-Corporation</p>
        </Section>
      </div>

      <div className="flex gap-4 mt-16 pt-8" style={{borderTop:'1px solid rgba(0,229,255,.07)'}}>
        <Link href="/terms" style={{fontSize:12,color:'rgba(0,229,255,.5)',textDecoration:'none'}}>Terms of Service</Link>
        <Link href="/" style={{fontSize:12,color:'rgba(0,229,255,.5)',textDecoration:'none'}}>Home</Link>
      </div>
    </div>
  </main>
}

function Section({title,children}:{title:string;children:React.ReactNode}) {
  return <div className="mb-8">
    <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:'.15em',color:'#00E5FF',marginBottom:12}}>{title}</h2>
    {children}
  </div>
}
