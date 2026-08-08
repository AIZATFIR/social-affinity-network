import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/contact.dart';
import 'providers/contact_provider.dart';
import 'ui/theme/app_theme.dart';
import 'ui/views/obsidian_orbit_view.dart';
import 'ui/views/circles_view.dart';
import 'ui/views/insights_view.dart';
import 'ui/views/kinship_drawer.dart';
import 'ui/widgets/add_contact_dialog.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => ContactProvider(),
      child: const SocialRelationManagerApp(),
    ),
  );
}

class SocialRelationManagerApp extends StatefulWidget {
  const SocialRelationManagerApp({super.key});

  @override
  State<SocialRelationManagerApp> createState() => _SocialRelationManagerAppState();
}

class _SocialRelationManagerAppState extends State<SocialRelationManagerApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _toggleTheme() {
    setState(() {
      if (_themeMode == ThemeMode.dark) {
        _themeMode = ThemeMode.light;
      } else {
        _themeMode = ThemeMode.dark;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Social Relation Manager (SRM)',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(),
      darkTheme: AppTheme.darkTheme(),
      themeMode: _themeMode,
      home: MainShellScreen(onToggleTheme: _toggleTheme),
    );
  }
}

class MainShellScreen extends StatefulWidget {
  final VoidCallback onToggleTheme;

  const MainShellScreen({super.key, required this.onToggleTheme});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  int _currentIndex = 0;
  Contact? _selectedContact;

  void _onContactSelected(Contact contact) {
    setState(() {
      _selectedContact = contact;
    });
  }

  void _closeDrawer() {
    setState(() {
      _selectedContact = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: (isDark ? const Color(0xFF0F172A) : Colors.white).withValues(alpha: 0.9),
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: const Color(0xFF0066CC),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.blur_on, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SRM',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                ),
                Text(
                  'Social Relation Manager',
                  style: TextStyle(fontSize: 10, color: Colors.grey),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Android Auto Sync Contacts Button
          IconButton(
            icon: const Icon(Icons.sync_outlined, size: 20),
            tooltip: 'Import HP Contacts',
            onPressed: () async {
              final provider = context.read<ContactProvider>();
              final count = await provider.syncDeviceContacts();
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(count > 0 ? '$count kontak berhasil diimpor!' : 'Semua kontak HP sudah tersinkronisasi.')),
                );
              }
            },
          ),
          // Theme Toggle
          IconButton(
            icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode, size: 20),
            onPressed: widget.onToggleTheme,
          ),
          const SizedBox(width: 8),
        ],
      ),

      body: Stack(
        children: [
          // View Switcher
          IndexedStack(
            index: _currentIndex,
            children: [
              ObsidianOrbitView(onContactSelected: _onContactSelected),
              CirclesView(onContactSelected: _onContactSelected),
              InsightsView(onContactSelected: _onContactSelected),
            ],
          ),

          // Slide-Over Kinship Drawer (Detail Overlay)
          if (_selectedContact != null)
            Positioned.fill(
              child: KinshipDrawer(
                contact: _selectedContact!,
                onClose: _closeDrawer,
              ),
            ),
        ],
      ),

      // Floating Center Add Button
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (_) => const AddContactDialog(),
          );
        },
        backgroundColor: const Color(0xFF0066CC),
        shape: const CircleBorder(),
        child: const Icon(Icons.add, color: Colors.white, size: 28),
      ),

      // Bottom Navigation Bar
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: Icon(Icons.blur_on, color: _currentIndex == 0 ? const Color(0xFF0066CC) : Colors.grey),
              tooltip: 'Orbit Canvas',
              onPressed: () => setState(() => _currentIndex = 0),
            ),
            IconButton(
              icon: Icon(Icons.groups, color: _currentIndex == 1 ? const Color(0xFF0066CC) : Colors.grey),
              tooltip: 'Dunbar Circles',
              onPressed: () => setState(() => _currentIndex = 1),
            ),
            const SizedBox(width: 48), // Space for FAB
            IconButton(
              icon: Icon(Icons.insights, color: _currentIndex == 2 ? const Color(0xFF0066CC) : Colors.grey),
              tooltip: 'Insights',
              onPressed: () => setState(() => _currentIndex = 2),
            ),
            IconButton(
              icon: const Icon(Icons.person_add_alt, color: Colors.grey),
              tooltip: 'Add Contact',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (_) => const AddContactDialog(),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
