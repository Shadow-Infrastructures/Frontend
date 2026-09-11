/** Document vault API functions. */
import { apiGetList } from './client';

export function listDocuments() {
  return apiGetList('/documents');
}
