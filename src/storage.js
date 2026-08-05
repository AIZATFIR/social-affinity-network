import { INITIAL_CONTACTS, TIER_CONFIG } from './types.js';

const STORAGE_KEY = 'social_affinity_contacts';

export class StorageManager {
  static getContacts() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveAll(INITIAL_CONTACTS);
      return INITIAL_CONTACTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CONTACTS;
    }
  }

  static saveAll(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }

  static saveContact(contactData) {
    const contacts = this.getContacts();
    const existingIndex = contacts.findIndex(c => c.id === contactData.id);
    if (existingIndex >= 0) {
      contacts[existingIndex] = contactData;
    } else {
      contactData.id = contactData.id || Date.now().toString();
      contactData.createdAt = new Date().toISOString();
      contacts.push(contactData);
    }
    this.saveAll(contacts);
    return contactData;
  }

  static deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.saveAll(contacts);
  }

  static getCapacityStats() {
    const contacts = this.getContacts();
    const stats = {};
    Object.keys(TIER_CONFIG).forEach(tier => {
      stats[tier] = {
        count: contacts.filter(c => c.tier === tier).length,
        recMax: TIER_CONFIG[tier].recMax,
        name: TIER_CONFIG[tier].name,
        color: TIER_CONFIG[tier].color
      };
    });
    return stats;
  }
}
