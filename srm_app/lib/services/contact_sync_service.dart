import 'package:flutter_contacts/flutter_contacts.dart' as fc;
import 'package:permission_handler/permission_handler.dart';
import '../models/contact.dart';
import '../models/dunbar_tier.dart';

class ContactSyncService {
  static Future<bool> requestPermission() async {
    final status = await Permission.contacts.request();
    return status.isGranted;
  }

  static Future<List<Contact>> fetchDeviceContacts() async {
    bool permissionGranted = await fc.FlutterContacts.requestPermission(readonly: true);
    if (!permissionGranted) {
      final status = await Permission.contacts.request();
      if (!status.isGranted) return [];
    }

    try {
      List<fc.Contact> deviceContacts = await fc.FlutterContacts.getContacts(
        withProperties: true,
        withPhoto: false,
      );

      List<Contact> imported = [];
      for (var dc in deviceContacts) {
        final name = dc.displayName.isNotEmpty ? dc.displayName : 'Kontak HP';
        final phone = dc.phones.isNotEmpty ? dc.phones.first.number : '';
        final initials = _extractInitials(name);

        imported.add(Contact(
          id: dc.id.isNotEmpty ? dc.id : DateTime.now().microsecondsSinceEpoch.toString(),
          name: name,
          avatarSymbol: 'phone_android',
          initials: initials,
          tier: 'friends',
          phone: phone,
          notes: 'Diimpor otomatis dari Kontak HP',
          attitudeTasks: List.from(DunbarTierData.configs['friends']!.defaultTasks),
        ));
      }
      return imported;
    } catch (e) {
      return [];
    }
  }

  static String _extractInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.isEmpty ? 'C' : name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();
  }
}
