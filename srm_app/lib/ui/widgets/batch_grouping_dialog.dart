import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class BatchGroupingDialog extends StatefulWidget {
  const BatchGroupingDialog({super.key});

  @override
  State<BatchGroupingDialog> createState() => _BatchGroupingDialogState();
}

class _BatchGroupingDialogState extends State<BatchGroupingDialog> {
  final Set<String> _selectedContactIds = {};
  String _targetTier = 'friends';
  String _searchFilter = '';

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    List<Contact> contacts = provider.contacts;

    if (_searchFilter.trim().isNotEmpty) {
      final q = _searchFilter.toLowerCase();
      contacts = contacts.where((c) => c.name.toLowerCase().contains(q)).toList();
    }

    final isAllSelected = contacts.isNotEmpty && _selectedContactIds.length == contacts.length;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 520, maxHeight: 640),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.swap_horiz_outlined, color: Color(0xFF0066CC)),
                    SizedBox(width: 8),
                    Text(
                      'Pindah Kontak Batch',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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

            // Target Tier Picker
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF5F5F7),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Pilih Lingkaran Tujuan:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  DropdownButtonFormField<String>(
                    initialValue: _targetTier,
                    decoration: const InputDecoration(
                      isDense: true,
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
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
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Search & Select All Controls
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Cari kontak...',
                      prefixIcon: const Icon(Icons.search, size: 18),
                      isDense: true,
                      contentPadding: const EdgeInsets.symmetric(vertical: 8),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onChanged: (val) => setState(() => _searchFilter = val),
                  ),
                ),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: () {
                    setState(() {
                      if (isAllSelected) {
                        _selectedContactIds.clear();
                      } else {
                        _selectedContactIds.addAll(contacts.map((c) => c.id));
                      }
                    });
                  },
                  child: Text(isAllSelected ? 'Deselect All' : 'Select All'),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Contact Multi-Select List
            Expanded(
              child: ListView.separated(
                itemCount: contacts.length,
                separatorBuilder: (_, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final c = contacts[index];
                  final isChecked = _selectedContactIds.contains(c.id);
                  final tierConfig = DunbarTierData.configs[c.tier];

                  return CheckboxListTile(
                    value: isChecked,
                    title: Text(c.name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    subtitle: Text('Sekarang di: ${tierConfig?.name ?? c.tier}', style: TextStyle(fontSize: 11, color: tierConfig?.color)),
                    onChanged: (val) {
                      setState(() {
                        if (val == true) {
                          _selectedContactIds.add(c.id);
                        } else {
                          _selectedContactIds.remove(c.id);
                        }
                      });
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 12),

            // Batch Action Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _selectedContactIds.isEmpty
                    ? null
                    : () async {
                        final nav = Navigator.of(context);
                        final messenger = ScaffoldMessenger.of(context);
                        final selectedCount = _selectedContactIds.length;
                        final targetName = DunbarTierData.configs[_targetTier]?.name;

                        for (var id in _selectedContactIds) {
                          final c = contacts.firstWhere((element) => element.id == id);
                          final updated = c.copyWith(
                            tier: _targetTier,
                            attitudeTasks: List.from(DunbarTierData.configs[_targetTier]?.defaultTasks ?? []),
                          );
                          await provider.updateContact(updated);
                        }

                        nav.pop();
                        messenger.showSnackBar(
                          SnackBar(content: Text('$selectedCount kontak berhasil dipindah ke $targetName')),
                        );
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0066CC),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                ),
                child: Text(
                  'Pindahkan ${_selectedContactIds.length} Kontak',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
