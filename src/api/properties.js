/** Property portfolio API functions. */
import { apiCreate, apiDelete, apiGetList } from './client';

export function listProperties() {
  return apiGetList('/properties');
}

export function createProperty(payload) {
  return apiCreate('/properties', payload);
}

export function deleteProperty(propertyId) {
  return apiDelete(`/properties/${propertyId}`);
}
