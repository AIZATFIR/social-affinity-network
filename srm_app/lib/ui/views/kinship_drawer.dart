import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';
import '../widgets/subtask_checklist.dart';
import '../widgets/add_contact_dialog.dart';

class KinshipDrawer extends StatelessWidget {
  final Contact contact;
  final VoidCallback onClose;

  const KinshipDrawer({
    super.key,
    required this.contact,
    required this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    final config = DunbarTierData.configs[contact.tier] ?? DunbarTierData.configs['friends']!;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: double.infinity,
      color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF5F5F7),
      child: Column(
        children: [
          // Drawer Header Navbar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E293B) : Colors.white,
              border: Border(bottom: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0))),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: onClose,
                ),
                Text(
                  contact.name,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  icon: const Icon(Icons.edit_outlined),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (_) => AddContactDialog(editingContact: contact),
                    );
                  },
                ),
              ],
            ),
          ),

          // Drawer Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Hero Avatar & Tier Badge
                  Center(
                    child: Column(
                      children: [
                        Container(
                          width: 84,
                          height: 84,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: config.color, width: 3),
                            color: isDark ? const Color(0xFF1E293B) : Colors.white,
                          ),
                          child: ClipOval(
                            child: contact.avatarPath != null && File(contact.avatarPath!).existsSync()
                                ? Image.file(File(contact.avatarPath!), fit: BoxFit.cover)
                                : Center(
                                    child: Icon(_getIconData(contact.avatarSymbol), size: 36, color: config.color),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          contact.name,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: config.color.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: config.color.withValues(alpha: 0.3)),
                          ),
                          child: Text(
                            config.name,
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: config.color),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Quick Contact Actions
                  Row(
                    children: [
                      if (contact.phone.isNotEmpty)
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.chat_bubble_outline, size: 16),
                            label: const Text('WhatsApp', style: TextStyle(fontSize: 12)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF34C759),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                          ),
                        ),
                      if (contact.phone.isNotEmpty && contact.instagram.isNotEmpty)
                        const SizedBox(width: 8),
                      if (contact.instagram.isNotEmpty)
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.camera_alt_outlined, size: 16),
                            label: const Text('Instagram', style: TextStyle(fontSize: 12)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F172A),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Google Tasks Style "How to Treat Them" Sub-Task Checklist Widget
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: SubtaskChecklistWidget(
                        contactId: contact.id,
                        tasks: contact.attitudeTasks,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Memory Notes Card
                  if (contact.notes.isNotEmpty)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.bookmark_outline, size: 18, color: Colors.amber),
                                SizedBox(width: 6),
                                Text(
                                  'Memory Notes & Reminders',
                                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              contact.notes,
                              style: const TextStyle(fontSize: 12, height: 1.4),
                            ),
                          ],
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),

                  // Delete Contact Button
                  SizedBox(
                    width: double.infinity,
                    child: TextButton.icon(
                      onPressed: () {
                        context.read<ContactProvider>().deleteContact(contact.id);
                        onClose();
                      },
                      icon: const Icon(Icons.delete_outline, color: Color(0xFFFF2D55), size: 18),
                      label: const Text(
                        'Hapus Kontak dari Orbit',
                        style: TextStyle(color: Color(0xFFFF2D55), fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
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
