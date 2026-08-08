import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/contact.dart';
import '../models/attitude_task.dart';

class StorageService {
  static const String _storageKey = 'srm_contacts_data';

  static Future<List<Contact>> loadContacts() async {
    final prefs = await SharedPreferences.getInstance();
    final String? raw = prefs.getString(_storageKey);

    if (raw == null || raw.isEmpty) {
      final initialList = _getInitialPresets();
      await saveContacts(initialList);
      return initialList;
    }

    try {
      final List<dynamic> jsonList = jsonDecode(raw);
      return jsonList.map((e) => Contact.fromJson(e as Map<String, dynamic>)).toList();
    } catch (e) {
      final initialList = _getInitialPresets();
      await saveContacts(initialList);
      return initialList;
    }
  }

  static Future<void> saveContacts(List<Contact> contacts) async {
    final prefs = await SharedPreferences.getInstance();
    final String jsonString = jsonEncode(contacts.map((c) => c.toJson()).toList());
    await prefs.setString(_storageKey, jsonString);
  }

  static List<Contact> _getInitialPresets() {
    return [
      Contact(
        id: '1',
        name: 'Sarah Rostova',
        avatarSymbol: 'favorite',
        initials: 'SR',
        tier: 'lovers',
        phone: '628123456789',
        instagram: 'sarah.rostova',
        notes: 'Suka es krim matcha. Hari Ulang Tahun: 14 Februari.',
        attitudeTasks: [
          AttitudeTask(id: 't1', text: 'Tanyakan kabar harian & dengarkan tanpa menyela'),
          AttitudeTask(id: 't2', text: 'Apresiasi usaha kecil & berikan dukungan emosional'),
          AttitudeTask(id: 't3', text: 'Agendakan quality time tiap akhir pekan'),
        ],
      ),
      Contact(
        id: '2',
        name: 'Budi Santoso',
        avatarSymbol: 'sports_esports',
        initials: 'BS',
        tier: 'close_friends',
        phone: '628987654321',
        instagram: 'budi_tech',
        notes: 'Teman diskusi teknologi & investasi.',
        attitudeTasks: [
          AttitudeTask(id: 't4', text: 'Saling dukung saat masa sulit & bersikap jujur'),
          AttitudeTask(id: 't5', text: 'Luangkan waktu nongkrong / mabar berkala'),
          AttitudeTask(id: 't6', text: 'Saling bantu dalam project pribadi'),
        ],
      ),
      Contact(
        id: '3',
        name: 'Ibu',
        avatarSymbol: 'home',
        initials: 'IB',
        tier: 'family',
        phone: '628111222333',
        instagram: '',
        notes: 'Hari Ulang Tahun: 10 Agustus. Senang diberi kabar harian singkat.',
        attitudeTasks: [
          AttitudeTask(id: 't7', text: 'Komunikasi berkala & tunjukkan rasa hormat'),
          AttitudeTask(id: 't8', text: 'Bantu kebutuhan urusan rumah tangga'),
          AttitudeTask(id: 't9', text: 'Rencanakan kumpul keluarga di hari besar'),
        ],
      ),
    ];
  }
}
