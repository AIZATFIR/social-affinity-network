import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class SocialImportDialog extends StatefulWidget {
  const SocialImportDialog({super.key});

  @override
  State<SocialImportDialog> createState() => _SocialImportDialogState();
}

class _SocialImportDialogState extends State<SocialImportDialog> {
  final TextEditingController _importTextController = TextEditingController();
  String _targetTier = 'acquaintances';

  @override
  void dispose() {
    _importTextController.dispose();
    super.dispose();
  }

  void _parseAndImport() async {
    final raw = _importTextController.text.trim();
    if (raw.isEmpty) return;

    final lines = raw.split('\n');
    int count = 0;

    for (var line in lines) {
      final text = line.trim();
      if (text.isEmpty) continue;

      // Extract name & instagram/handle if comma separated or space
      final parts = text.split(',');
      final name = parts[0].trim();
      final instagram = parts.length > 1 ? parts[1].trim() : '';

      final initials = _extractInitials(name);

      final newContact = Contact(
        id: DateTime.now().microsecondsSinceEpoch.toString() + count.toString(),
        name: name,
        avatarSymbol: 'work',
        initials: initials,
        tier: _targetTier,
        instagram: instagram,
        notes: 'Diimpor dari LinkedIn / Social Followers',
        attitudeTasks: List.from(DunbarTierData.configs[_targetTier]?.defaultTasks ?? []),
      );

      await context.read<ContactProvider>().addContact(newContact);
      count++;
    }

    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$count kontak social follower/LinkedIn berhasil diimpor!')),
      );
    }
  }

  String _extractInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.isEmpty ? 'C' : name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 480),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.share_outlined, color: Color(0xFF0066CC)),
                    SizedBox(width: 8),
                    Text(
                      'Import Social / LinkedIn / CSV',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 10),

            const Text(
              'Paste daftar nama follower Instagram, koneksi LinkedIn, atau teks daftar kontak (1 nama per baris):',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _importTextController,
              maxLines: 6,
              style: const TextStyle(fontSize: 12),
              decoration: const InputDecoration(
                hintText: 'Contoh:\nBudi Santoso, @budi_tech\nSarah Rostova, @sarah.rostova\nAlex Rivers',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
              ),
            ),
            const SizedBox(height: 12),

            // Target Tier Selection
            DropdownButtonFormField<String>(
              initialValue: _targetTier,
              decoration: const InputDecoration(
                labelText: 'Lingkaran Tujuan Import *',
                isDense: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              ),
              items: DunbarTierData.configs.entries.map((e) {
                return DropdownMenuItem(
                  value: e.key,
                  child: Text('${e.value.name} (${e.value.description})'),
                );
              }).toList(),
              onChanged: (v) {
                if (v != null) setState(() => _targetTier = v);
              },
            ),
            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _parseAndImport,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0066CC),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                ),
                child: const Text(
                  'Import Kontak Sekarang',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
