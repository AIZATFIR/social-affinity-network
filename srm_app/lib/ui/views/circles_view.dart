import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';
import '../widgets/batch_grouping_dialog.dart';
import '../widgets/social_import_dialog.dart';

class CirclesView extends StatelessWidget {
  final Function(Contact) onContactSelected;

  const CirclesView({
    super.key,
    required this.onContactSelected,
  });

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Action Header with Batch Transfer & Social Import
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dunbar Social Circles',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Batasan Energi & Kapasitas Sosialisasi Mandiri',
                      style: TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.swap_horiz, color: Color(0xFF0066CC)),
                      tooltip: 'Pindah Kontak Batch',
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (_) => const BatchGroupingDialog(),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.share, color: Color(0xFF0066CC)),
                      tooltip: 'Import Social / LinkedIn',
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (_) => const SocialImportDialog(),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Tier Cards List
            ...DunbarTierData.configs.entries.map((entry) {
              final tierKey = entry.key;
              final config = entry.value;
              final members = provider.getContactsInTier(tierKey);

              final int currentCount = members.length;
              final int maxCap = config.recMax;
              final double ratio = (currentCount / maxCap).clamp(0.0, 1.0);
              final bool isOverCap = currentCount > maxCap;

              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isOverCap
                        ? const Color(0xFFFF2D55)
                        : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                    width: isOverCap ? 2 : 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                      blurRadius: 10,
                    )
                  ],
                ),
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
                                shape: BoxShape.circle,
                              ),
                              child: Icon(_getIcon(config.iconSymbol), color: config.color, size: 20),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  config.name,
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
                            color: isOverCap ? const Color(0xFFFF2D55) : config.color.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '$currentCount / $maxCap',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isOverCap ? Colors.white : config.color,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Progress Bar
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: ratio,
                        minHeight: 6,
                        backgroundColor: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                        color: isOverCap ? const Color(0xFFFF2D55) : config.color,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Contact Chips
                    if (members.isEmpty)
                      const Text(
                        'Belum ada kontak di lingkaran ini.',
                        style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey),
                      )
                    else
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: members.map((contact) {
                          return InkWell(
                            onTap: () => onContactSelected(contact),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF5F5F7),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  CircleAvatar(
                                    radius: 12,
                                    backgroundColor: config.color.withValues(alpha: 0.2),
                                    backgroundImage: contact.avatarPath != null && File(contact.avatarPath!).existsSync()
                                        ? FileImage(File(contact.avatarPath!))
                                        : null,
                                    child: contact.avatarPath == null
                                        ? Text(
                                            contact.initials,
                                            style: TextStyle(fontSize: 9, color: config.color, fontWeight: FontWeight.bold),
                                          )
                                        : null,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    contact.name,
                                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  IconData _getIcon(String symbol) {
    switch (symbol) {
      case 'favorite': return Icons.favorite;
      case 'verified': return Icons.verified;
      case 'home': return Icons.home;
      case 'groups': return Icons.groups;
      default: return Icons.person_outline;
    }
  }
}
