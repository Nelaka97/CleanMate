// plugins/supabase.client.ts
import { createClient } from '@supabase/supabase-js'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const supabaseUrl = 'https://gtyxoyudnyewhudjtkml.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0eXhveXVkbnlld2h1ZGp0a21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjUxODAsImV4cCI6MjA2Njk0MTE4MH0.Xd3nREBabqBwPRIEJGe9uKOvrSipML6lb0dUU1XqUKg'
  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase
    }
  }
})
