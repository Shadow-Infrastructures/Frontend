/** Refinance API functions. Backend may not expose this yet. */
import { apiGetList } from './client';

export function listRefinanceOptions() {
  return apiGetList('/refinance');
}
