import { useState } from '#app'

export function useRegion(){
  const region = useState('region', () => 'Mayen-Koblenz')
  const setRegion = (r) => { region.value = r || '' }
  return { region, setRegion }
}
