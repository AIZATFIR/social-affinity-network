import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class InsightsView extends StatelessWidget {
  final Function(Contact) onContactSelected;

  const InsightsView({
    super.key,
    required this.onContactSelected,
  });

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final healthScore = provider.networkHealthScore;
    final loversCount = provider.getContactsInTier('lovers').length;
    final closeCount = provider.getContactsInTier('close_friends').length;
    final totalContacts = provider.contacts.length;

    // Social Energy Budget Expenditure Calculation
    double totalEnergySpent = 0.0;
    for (var c in provider.contacts) {
      final config = DunbarTierData.configs[c.tier];
      if (config != null) {
        totalEnergySpent += config.energyWeight;
      }
    }

    final bool isBurnoutRisk = totalEnergySpent > 100.0 || loversCount > 1;

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Alokasi Energi & Health Score',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            const Text(
              'Menjaga batasan energi sosial agar tidak burnout emosional.',
              style: TextStyle(fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 16),

            // Network Health Score Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                    blurRadius: 12,
                  )
                ],
              ),
              child: Row(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 80,
                        height: 80,
                        child: CircularProgressIndicator(
                          value: (healthScore / 100).clamp(0.0, 1.0),
                          strokeWidth: 8,
                          backgroundColor: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                          color: healthScore >= 80
                              ? const Color(0xFF34C759)
                              : (healthScore >= 50 ? const Color(0xFFFFCC00) : const Color(0xFFFF2D55)),
                        ),
                      ),
                      Text(
                        '$healthScore',
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Kesehatan Relasi Sosial',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          healthScore >= 80
                              ? 'Sangat Ideal! Kapasitas relasi sosial Anda seimbang sesuai batas Dunbar.'
                              : (loversCount > 1
                                  ? 'Peringatan: Lovers melebihi batas 1 orang.'
                                  : 'Perlu penyesuaian alokasi energi relasi.'),
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Social Energy Budget Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isBurnoutRisk
                      ? const Color(0xFFFF2D55)
                      : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                  width: isBurnoutRisk ? 2 : 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.bolt, color: Color(0xFFFFCC00)),
                          SizedBox(width: 6),
                          Text(
                            'Alokasi Energi Emosional Harian',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Text(
                        '${totalEnergySpent.toStringAsFixed(1)}% / 100%',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: isBurnoutRisk ? const Color(0xFFFF2D55) : const Color(0xFF34C759),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: (totalEnergySpent / 100.0).clamp(0.0, 1.0),
                      minHeight: 8,
                      backgroundColor: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0),
                      color: isBurnoutRisk ? const Color(0xFFFF2D55) : const Color(0xFF0066CC),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    isBurnoutRisk
                        ? '⚠️ Peringatan Overload: Anda menginvestasikan energi melebihi batas 100%. Pindahkan beberapa kontak ke Kenalan (1500 limit).'
                        : '💡 Investasi energi Anda sehat. Ingat, kenalan 1500 tidak sedalam Teman Dekat (5) & Teman (150).',
                    style: TextStyle(
                      fontSize: 11,
                      color: isBurnoutRisk ? const Color(0xFFFF2D55) : Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Summary Stats Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    title: 'Total Kontak',
                    value: '$totalContacts',
                    subtitle: 'Max 1666 (Dunbar)',
                    color: const Color(0xFF0066CC),
                    isDark: isDark,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    title: 'Close Friends',
                    value: '$closeCount / 5',
                    subtitle: 'Sangat Intim',
                    color: const Color(0xFFFFCC00),
                    isDark: isDark,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required String subtitle,
    required Color color,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey)),
        ],
      ),
    );
  }
}
