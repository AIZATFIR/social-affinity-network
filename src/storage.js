import { INITIAL_CONTACTS, TIER_CONFIG } from './types.js';
import { db, collection, doc, setDoc, deleteDoc, onSnapshot } from './firebase.js';

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

  static async saveContact(contactData, userId = null) {
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

    // Sync to Cloud Firestore if logged in
    if (userId) {
      try {
        const contactRef = doc(db, 'users', userId, 'contacts', contactData.id);
        await setDoc(contactRef, contactData);
      } catch (e) {
        console.warn('Firestore sync warning:', e);
      }
    }
    return contactData;
  }

  static async deleteContact(id, userId = null) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    this.saveAll(contacts);

    if (userId) {
      try {
        const contactRef = doc(db, 'users', userId, 'contacts', id);
        await deleteDoc(contactRef);
      } catch (e) {
        console.warn('Firestore delete warning:', e);
      }
    }
  }

  static async resetNodePositions(userId = null) {
    const contacts = this.getContacts().map(c => {
      const { leftPos, topPos, dx, dy, ...rest } = c;
      return rest;
    });
    this.saveAll(contacts);
    if (userId) {
      for (const c of contacts) {
        await this.saveContact(c, userId);
      }
    }
    return contacts;
  }

  static exportToJson() {
    const contacts = this.getContacts();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contacts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `srm_contacts_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static exportToCsv() {
    const contacts = this.getContacts();
    if (contacts.length === 0) return;

    const headers = ["Name", "Tier", "Phone", "Instagram", "Notes"];
    const rows = contacts.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.tier || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.instagram || '').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `srm_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static async importFromJson(jsonData, userId = null) {
    if (!Array.isArray(jsonData)) return false;
    for (const c of jsonData) {
      if (c && c.name && c.tier) {
        await this.saveContact(c, userId);
      }
    }
    return true;
  }

  static subscribeCloudSync(userId, onUpdate) {
    if (!userId) return null;
    const contactsRef = collection(db, 'users', userId, 'contacts');
    return onSnapshot(contactsRef, (snapshot) => {
      const contacts = [];
      snapshot.forEach(docSnap => {
        contacts.push(docSnap.data());
      });
      if (contacts.length > 0) {
        this.saveAll(contacts);
        onUpdate(contacts);
      }
    }, (err) => {
      console.warn('Firestore subscription notice:', err.message);
    });
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
