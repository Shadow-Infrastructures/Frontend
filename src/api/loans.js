/** Mortgage and loan tracking API functions. */
import { apiGetList } from './client';

export function listLoans() {
  return apiGetList('/loans');
}
