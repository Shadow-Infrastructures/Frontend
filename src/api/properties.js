/** Property portfolio API functions. */
import { apiCreate, apiDelete, apiGetList, apiRequest } from './client';

export function listProperties() {
  return apiGetList('/properties');
}

export function getProperty(propertyId) {
  return apiRequest(`/properties/${propertyId}`);
}

export function createProperty(payload) {
  return apiCreate('/properties', payload);
}

export function deleteProperty(propertyId) {
  return apiDelete(`/properties/${propertyId}`);
}
