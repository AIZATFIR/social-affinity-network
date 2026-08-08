import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class CirclesView extends StatelessWidget {
  final Function(Contact) onContactSelected;

  const CirclesView({super.key, required this.onContactSelected});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    final contacts = provider.contacts;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Lingkaran Hubungan (Dunbar Tiers)',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        const Text(
          'Manajemen batas kapasitas hubungan emosional & sosial yang sehat',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 16),

        ...DunbarTierData.configs.entries.map((entry) {
          final config = entry.value;
          final members = contacts.where((c) => c.tier == entry.key).toList();
          final isOver = members.length > config.recMax;
          final percent = (members.length / config.recMax).clamp(0.0, 1.0);

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: BorderSide(
                color: isOver ? const Color(0xFFFF2D55) : (Theme.of(context).brightness == Brightness.dark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                width: isOver ? 2 : 1,
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: config.color.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(_getIconData(config.iconSymbol), color: config.color, size: 20),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                config.name,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                config.description,
                                style: const TextStyle(fontSize: 11, color: Colors.grey),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isOver ? const Color(0xFFFF2D55).withValues(alpha: 0.2) : Colors.grey.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${members.length} / ${config.recMax}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isOver ? const Color(0xFFFF2D55) : config.color,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Progress Bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: percent,
                      minHeight: 6,
                      backgroundColor: config.color.withValues(alpha: 0.15),
                      valueColor: AlwaysStoppedAnimation<Color>(config.color),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Member Chips Grid
                  if (members.isNotEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: members.map((m) {
                        return ActionChip(
                          avatar: CircleAvatar(
                            backgroundColor: config.color.withValues(alpha: 0.2),
                            backgroundImage: m.avatarPath != null && File(m.avatarPath!).existsSync()
                                ? FileImage(File(m.avatarPath!))
                                : null,
                            child: m.avatarPath == null
                                ? Text(m.initials, style: TextStyle(fontSize: 10, color: config.color, fontWeight: FontWeight.bold))
                                : null,
                          ),
                          label: Text(m.name, style: const TextStyle(fontSize: 12)),
                          onPressed: () => onContactSelected(m),
                        );
                      }).toList(),
                    )
                  else
                    const Text(
                      'Belum ada kontak di lingkaran ini.',
                      style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey),
                    ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  IconData _getIconData(String symbol) {
    switch (symbol) {
      case 'favorite': return Icons.favorite;
      case 'verified': return Icons.verified;
      case 'home': return Icons.home;
      case 'work': return Icons.work;
      case 'sports_esports': return Icons.sports_esports;
      case 'code': return Icons.code;
      case 'school': return Icons.school;
      case 'local_cafe': return Icons.local_cafe;
      default: return Icons.person;
    }
  }
}
