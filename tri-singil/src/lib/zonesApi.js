import { supabase } from './supabaseClient'

// PostgREST serializes PostGIS geometry columns as GeoJSON automatically,
// so `boundary` comes back as a ready-to-use GeoJSON Polygon.
export async function fetchZones() {
  const { data, error } = await supabase.from('zones').select('*')
  if (error) throw error
  return data
}

export async function fetchFareMatrix() {
  const { data, error } = await supabase
    .from('fare_matrix')
    .select('*')
    .eq('is_active', true)
  if (error) throw error
  return data
}

export async function fetchModifiers() {
  const { data, error } = await supabase
    .from('fare_modifiers')
    .select('*')
    .eq('is_active', true)
  if (error) throw error
  return data
}
