import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';

class AddContactDialog extends StatefulWidget {
  final Contact? editingContact;

  const AddContactDialog({super.key, this.editingContact});

  @override
  State<AddContactDialog> createState() => _AddContactDialogState();
}

class _AddContactDialogState extends State<AddContactDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _instagramController;
  late TextEditingController _notesController;

  late String _selectedTier;
  late String _selectedSymbol;
  String? _avatarPath;

  final ImagePicker _picker = ImagePicker();

  final List<Map<String, String>> _symbols = [
    {'symbol': 'person', 'label': 'Personal'},
    {'symbol': 'favorite', 'label': 'Lover'},
    {'symbol': 'verified', 'label': 'Verified'},
    {'symbol': 'home', 'label': 'Family'},
    {'symbol': 'work', 'label': 'Work'},
    {'symbol': 'sports_esports', 'label': 'Gaming'},
    {'symbol': 'code', 'label': 'Tech'},
    {'symbol': 'school', 'label': 'Campus'},
    {'symbol': 'local_cafe', 'label': 'Social'},
  ];

  @override
  void initState() {
    super.initState();
    final c = widget.editingContact;
    _nameController = TextEditingController(text: c?.name ?? '');
    _phoneController = TextEditingController(text: c?.phone ?? '');
    _instagramController = TextEditingController(text: c?.instagram ?? '');
    _notesController = TextEditingController(text: c?.notes ?? '');

    _selectedTier = c?.tier ?? 'friends';
    _selectedSymbol = c?.avatarSymbol ?? 'person';
    _avatarPath = c?.avatarPath;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _instagramController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final XFile? picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() {
        _avatarPath = picked.path;
      });
    }
  }

  void _saveForm() {
    if (_formKey.currentState!.validate()) {
      final name = _nameController.text.trim();
      final phone = _phoneController.text.trim();
      final instagram = _instagramController.text.trim();
      final notes = _notesController.text.trim();

      final parts = name.split(' ');
      final initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();

      if (widget.editingContact != null) {
        final updated = widget.editingContact!.copyWith(
          name: name,
          phone: phone,
          instagram: instagram,
          notes: notes,
          tier: _selectedTier,
          avatarSymbol: _selectedSymbol,
          avatarPath: _avatarPath,
          initials: initials,
        );
        context.read<ContactProvider>().updateContact(updated);
      } else {
        final newContact = Contact(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          name: name,
          phone: phone,
          instagram: instagram,
          notes: notes,
          tier: _selectedTier,
          avatarSymbol: _selectedSymbol,
          avatarPath: _avatarPath,
          initials: initials,
          attitudeTasks: List.from(DunbarTierData.configs[_selectedTier]?.defaultTasks ?? []),
        );
        context.read<ContactProvider>().addContact(newContact);
      }

      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.editingContact != null;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: Container(
        padding: const EdgeInsets.all(24),
        constraints: const BoxConstraints(maxWidth: 480),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      isEdit ? 'Edit Contact' : 'Add New Contact',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Avatar Picture Picker / Initial Badge
                Center(
                  child: Stack(
                    children: [
                      CircleAvatar(
                        radius: 40,
                        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.grey[200],
                        backgroundImage: _avatarPath != null && File(_avatarPath!).existsSync()
                            ? FileImage(File(_avatarPath!))
                            : null,
                        child: _avatarPath == null
                            ? Icon(_getIconData(_selectedSymbol), size: 36, color: const Color(0xFF0066CC))
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: InkWell(
                          onTap: _pickImage,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: Color(0xFF0066CC),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.photo_camera, size: 16, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Contact Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Contact Name *',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                  ),
                  validator: (v) => v == null || v.trim().isEmpty ? 'Nama kontak wajib diisi' : null,
                ),
                const SizedBox(height: 12),

                // Dunbar Tier Selection
                DropdownButtonFormField<String>(
                  initialValue: _selectedTier,
                  decoration: const InputDecoration(
                    labelText: 'Dunbar Social Circle *',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                  ),
                  items: DunbarTierData.configs.entries.map((e) {
                    return DropdownMenuItem(
                      value: e.key,
                      child: Text('${e.value.name} (${e.value.recMax} Max)'),
                    );
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _selectedTier = v);
                  },
                ),
                const SizedBox(height: 12),

                // Symbol Selector Grid
                const Text('Choose Icon Symbol:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                SizedBox(
                  height: 44,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _symbols.length,
                    separatorBuilder: (_, index) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final item = _symbols[index];
                      final isSelected = _selectedSymbol == item['symbol'];
                      return InkWell(
                        onTap: () => setState(() => _selectedSymbol = item['symbol']!),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFF0066CC).withValues(alpha: 0.15)
                                : (isDark ? const Color(0xFF1E293B) : Colors.grey[200]),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF0066CC) : Colors.transparent,
                              width: 2,
                            ),
                          ),
                          child: Icon(_getIconData(item['symbol']!), size: 20, color: const Color(0xFF0066CC)),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),

                // Phone & Instagram
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _phoneController,
                        decoration: const InputDecoration(
                          labelText: 'WhatsApp Phone',
                          border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextFormField(
                        controller: _instagramController,
                        decoration: const InputDecoration(
                          labelText: 'Instagram',
                          border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Memory Notes
                TextFormField(
                  controller: _notesController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Memory Notes & Reminders',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16))),
                  ),
                ),
                const SizedBox(height: 20),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _saveForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0066CC),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    child: Text(
                      isEdit ? 'Save Changes' : 'Add to Orbit',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
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
