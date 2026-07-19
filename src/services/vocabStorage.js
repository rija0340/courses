import { ACTIVE_PROVIDER, STORAGE_PROVIDERS } from './storageConfig';
import localStorageProvider from './providers/localStorageProvider';
import supabaseProvider from './providers/supabaseProvider';

const provider = ACTIVE_PROVIDER === STORAGE_PROVIDERS.SUPABASE
  ? supabaseProvider
  : localStorageProvider;

const vocabStorage = {
  async getDomain(domainId) {
    return provider.getDomain(domainId);
  },

  async saveDomain(domainId, data) {
    return provider.saveDomain(domainId, data);
  },

  async initDomain(domainId) {
    return provider.initDomain(domainId);
  },

  async getOrganization(domainId) {
    return provider.getOrganization(domainId);
  },

  async updateOrganization(domainId, organization) {
    return provider.updateOrganization(domainId, organization);
  },

  async updateCategories(domainId, categories) {
    return provider.updateCategories(domainId, categories);
  },

  async updateMeta(domainId, meta) {
    return provider.updateMeta(domainId, meta);
  },

  async getItems(domainId) {
    return provider.getItems(domainId);
  },

  async createItem(domainId, item) {
    return provider.createItem(domainId, item);
  },

  async updateItem(domainId, id, data) {
    return provider.updateItem(domainId, id, data);
  },

  async deleteItem(domainId, id) {
    return provider.deleteItem(domainId, id);
  },

  async getImage(domainId, itemId) {
    return provider.getImage(domainId, itemId);
  },

  async saveImage(domainId, itemId, base64) {
    return provider.saveImage(domainId, itemId, base64);
  },

  async deleteImage(domainId, itemId) {
    return provider.deleteImage(domainId, itemId);
  },

  async getCategoryImage(domainId, categoryId) {
    return provider.getCategoryImage(domainId, categoryId);
  },

  async saveCategoryImage(domainId, categoryId, base64) {
    return provider.saveCategoryImage(domainId, categoryId, base64);
  },

  async deleteCategoryImage(domainId, categoryId) {
    return provider.deleteCategoryImage(domainId, categoryId);
  },

  async exportAll(domainId) {
    return provider.exportAll(domainId);
  },

  async resetDomain(domainId) {
    return provider.resetDomain(domainId);
  }
};

export default vocabStorage;
export { provider as activeProvider };
