import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class InsightsView extends StatelessWidget {
  final Function(Contact) onContactSelected;

  const InsightsView({super.key, required this.onContactSelected});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    final contacts = provider.contacts;
    final healthScore = provider.healthScore;

    final priorityList = contacts
        .where((c) => ['lovers', 'close_friends', 'family'].contains(c.tier))
        .toList();

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Analitik Kesehatan Hubungan',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        const Text(
          'Evaluasi keseimbangan jaringan sosial menurut Hukum Dunbar 1500',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 16),

        // Metrics Row
        Row(
          children: [
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.favorite, size: 16, color: Color(0xFFFF2D55)),
                          SizedBox(width: 4),
                          Text('Health Score', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '$healthScore%',
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFF0066CC)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        healthScore >= 80 ? 'Optimal' : 'Perlu Perhatian',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: healthScore >= 80 ? const Color(0xFF34C759) : Colors.amber,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.groups, size: 16, color: Colors.indigo),
                          SizedBox(width: 4),
                          Text('Total Contacts', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${contacts.length}',
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
                      ),
                      const SizedBox(height: 4),
                      const Text('/ 1500 Dunbar Max', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Distribution Breakdown Card
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.pie_chart_outline, size: 18, color: Color(0xFF0066CC)),
                    SizedBox(width: 6),
                    Text('Distribusi Lingkaran Hubungan', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 16),
                ...DunbarTierData.configs.entries.map((entry) {
                  final config = entry.value;
                  final count = contacts.where((c) => c.tier == entry.key).length;
                  final percent = contacts.isNotEmpty ? count / contacts.length : 0.0;

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(config.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('$count Kontak (${(percent * 100).round()}%)', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: percent,
                            minHeight: 6,
                            backgroundColor: config.color.withValues(alpha: 0.15),
                            valueColor: AlwaysStoppedAnimation<Color>(config.color),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Priority Focus List
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.star_outline, size: 18, color: Colors.amber),
                        SizedBox(width: 6),
                        Text('Fokus Perhatian Utama', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Text('${priorityList.length} Orang', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 12),
                if (priorityList.isEmpty)
                  const Text('Belum ada kontak di prioritas utama.', style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey))
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: priorityList.length,
                    separatorBuilder: (_, index) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final c = priorityList[index];
                      final config = DunbarTierData.configs[c.tier]!;
                      return ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: CircleAvatar(
                          backgroundColor: config.color.withValues(alpha: 0.2),
                          backgroundImage: c.avatarPath != null && File(c.avatarPath!).existsSync()
                              ? FileImage(File(c.avatarPath!))
                              : null,
                          child: c.avatarPath == null
                              ? Text(c.initials, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: config.color))
                              : null,
                        ),
                        title: Text(c.name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        subtitle: Text(config.name, style: TextStyle(fontSize: 11, color: config.color)),
                        onTap: () => onContactSelected(c),
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
