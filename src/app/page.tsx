'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      // TEMP: sign‑in anonymously just to test RLS
      const { data: { user } } = await supabase.auth.signInAnonymously()

      // Replace with your tenant’s real UUID for testing
      const TENANT = 'YOUR‑TENANT‑UUID'

      // Insert a sample event if none exist
      await supabase.from('events').upsert({
        tenant_id: TENANT,
        name: 'Test Summit',
        start_date: '2025-09-10',
        end_date: '2025-09-12',
        location: 'London'
      })

      // Now fetch
      const { data } = await supabase.from('events').select('*')
      setEvents(data ?? [])
    })()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Events (tenant‑filtered)</h1>
      {events.map(e => (
        <div key={e.event_id} className="border p-4 mb-2 rounded">
          {e.name} – {e.start_date} to {e.end_date}
        </div>
      ))}
    </main>
  )
}
