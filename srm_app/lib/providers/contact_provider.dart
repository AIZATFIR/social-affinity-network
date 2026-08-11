import 'package:flutter/material.dart';

import '../models/contact.dart';
import '../models/attitude_task.dart';
import '../services/storage_service.dart';
import '../services/contact_sync_service.dart';

class ContactProvider extends ChangeNotifier {
  List<Contact> _contacts = [];
  bool _isLoading = true;
  String _selectedTierFilter = 'all';
  String _searchQuery = '';
  Contact? _selectedContact;

  List<Contact> get contacts => _contacts;
  bool get isLoading => _isLoading;
  String get selectedTierFilter => _selectedTierFilter;
  String get searchQuery => _searchQuery;
  Contact? get selectedContact => _selectedContact;

  ContactProvider() {
    initData();
  }

  Future<void> initData() async {
    _isLoading = true;
    notifyListeners();
    _contacts = await StorageService.loadContacts();
    _isLoading = false;
    notifyListeners();
  }

  List<Contact> get filteredContacts {
    List<Contact> list = List.from(_contacts);
    if (_selectedTierFilter != 'all') {
      list = list.where((c) => c.tier == _selectedTierFilter).toList();
    }
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((c) =>
        c.name.toLowerCase().contains(q) ||
        c.notes.toLowerCase().contains(q) ||
        c.phone.contains(q)
      ).toList();
    }
    return list;
  }

  List<Contact> getContactsInTier(String tierKey) {
    return _contacts.where((c) => c.tier == tierKey).toList();
  }

  void setFilter(String tierKey) {
    _selectedTierFilter = tierKey;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void selectContact(Contact? contact) {
    _selectedContact = contact;
    notifyListeners();
  }

  Future<void> addContact(Contact contact) async {
    _contacts.add(contact);
    await StorageService.saveContacts(_contacts);
    notifyListeners();
  }

  Future<void> updateContact(Contact updated) async {
    final index = _contacts.indexWhere((c) => c.id == updated.id);
    if (index != -1) {
      _contacts[index] = updated;
      if (_selectedContact?.id == updated.id) {
        _selectedContact = updated;
      }
      await StorageService.saveContacts(_contacts);
      notifyListeners();
    }
  }

  Future<void> deleteContact(String id) async {
    _contacts.removeWhere((c) => c.id == id);
    if (_selectedContact?.id == id) {
      _selectedContact = null;
    }
    await StorageService.saveContacts(_contacts);
    notifyListeners();
  }

  Future<void> updatePosition(String id, double dx, double dy) async {
    final index = _contacts.indexWhere((c) => c.id == id);
    if (index != -1) {
      _contacts[index].dx = dx;
      _contacts[index].dy = dy;
      await StorageService.saveContacts(_contacts);
      notifyListeners();
    }
  }

  // Google Tasks Style Sub-Task Checklist Operations
  Future<void> addAttitudeTask(String contactId, String text) async {
    final index = _contacts.indexWhere((c) => c.id == contactId);
    if (index != -1 && text.trim().isNotEmpty) {
      final newTask = AttitudeTask(
        id: DateTime.now().microsecondsSinceEpoch.toString(),
        text: text.trim(),
      );
      _contacts[index].attitudeTasks.add(newTask);
      if (_selectedContact?.id == contactId) {
        _selectedContact = _contacts[index];
      }
      await StorageService.saveContacts(_contacts);
      notifyListeners();
    }
  }

  Future<void> toggleAttitudeTask(String contactId, String taskId) async {
    final index = _contacts.indexWhere((c) => c.id == contactId);
    if (index != -1) {
      final taskIndex = _contacts[index].attitudeTasks.indexWhere((t) => t.id == taskId);
      if (taskIndex != -1) {
        _contacts[index].attitudeTasks[taskIndex].isDone =
            !_contacts[index].attitudeTasks[taskIndex].isDone;
        if (_selectedContact?.id == contactId) {
          _selectedContact = _contacts[index];
        }
        await StorageService.saveContacts(_contacts);
        notifyListeners();
      }
    }
  }

  Future<void> deleteAttitudeTask(String contactId, String taskId) async {
    final index = _contacts.indexWhere((c) => c.id == contactId);
    if (index != -1) {
      _contacts[index].attitudeTasks.removeWhere((t) => t.id == taskId);
      if (_selectedContact?.id == contactId) {
        _selectedContact = _contacts[index];
      }
      await StorageService.saveContacts(_contacts);
      notifyListeners();
    }
  }

  // Android Contact Auto-Sync
  Future<int> syncDeviceContacts() async {
    final imported = await ContactSyncService.fetchDeviceContacts();
    int addedCount = 0;

    for (var c in imported) {
      final exists = _contacts.any((existing) =>
          existing.phone.isNotEmpty && existing.phone == c.phone);
      if (!exists) {
        _contacts.add(c);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      await StorageService.saveContacts(_contacts);
      notifyListeners();
    }
    return addedCount;
  }

  // Health Score Calculation
  int get healthScore {
    if (_contacts.isEmpty) return 100;
    int score = 95;
    final loversCount = _contacts.where((c) => c.tier == 'lovers').length;
    final closeCount = _contacts.where((c) => c.tier == 'close_friends').length;

    if (loversCount > 1) score -= 20;
    if (closeCount > 5) score -= 15;
    return score.clamp(0, 100);
  }

  int get networkHealthScore => healthScore;
}
