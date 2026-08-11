import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../models/contact.dart';
import '../../models/dunbar_tier.dart';
import '../../providers/contact_provider.dart';
import '../widgets/orbit_painter.dart';

class ObsidianOrbitView extends StatefulWidget {
  final Function(Contact) onContactSelected;

  const ObsidianOrbitView({
    super.key,
    required this.onContactSelected,
  });

  @override
  State<ObsidianOrbitView> createState() => _ObsidianOrbitViewState();
}

class _ObsidianOrbitViewState extends State<ObsidianOrbitView> {
  final TransformationController _transformationController = TransformationController();

  @override
  void dispose() {
    _transformationController.dispose();
    super.dispose();
  }

  void _resetZoom() {
    _transformationController.value = Matrix4.identity();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ContactProvider>();
    final contacts = provider.filteredContacts;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    const double canvasSize = 3600.0;
    const Offset centerOffset = Offset(canvasSize / 2, canvasSize / 2);

    return Container(
      color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF5F5F7),
      child: Stack(
        children: [
          // Interactive Obsidian-Style Zoom & Pan Canvas
          InteractiveViewer(
            transformationController: _transformationController,
            minScale: 0.1,
            maxScale: 3.5,
            boundaryMargin: const EdgeInsets.all(2000),
            clipBehavior: Clip.none,
            child: SizedBox(
              width: canvasSize,
              height: canvasSize,
              child: Stack(
                children: [
                  // CustomPainter for Concentric Rings & Grid Background
                  CustomPaint(
                    size: const Size(canvasSize, canvasSize),
                    painter: OrbitPainter(isDark: isDark),
                  ),

                  // Center Node: YOU (Inner Intimacy Core)
                  Positioned(
                    left: centerOffset.dx - 36,
                    top: centerOffset.dy - 36,
                    child: Tooltip(
                      message: 'Pusat Energi Sosialisasi (YOU)',
                      child: Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDark ? const Color(0xFF1E293B) : Colors.white,
                          border: Border.all(color: const Color(0xFFFFCC00), width: 3),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFFFCC00).withValues(alpha: 0.4),
                              blurRadius: 28,
                              spreadRadius: 4,
                            )
                          ],
                        ),
                        child: const Center(
                          child: Icon(Icons.account_circle, size: 40, color: Color(0xFFFFCC00)),
                        ),
                      ),
                    ),
                  ),

                  // Contact Orbit Nodes
                  ..._buildOrbitNodes(contacts, centerOffset),
                ],
              ),
            ),
          ),

          // Controls overlay: Reset Zoom & Legend
          Positioned(
            top: 16,
            right: 16,
            child: FloatingActionButton.small(
              onPressed: _resetZoom,
              backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
              child: const Icon(Icons.center_focus_strong, size: 20),
            ),
          ),

          // Bottom Legend Overlay (Dunbar 1500 & Social Energy Cues)
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: (isDark ? const Color(0xFF0F172A) : Colors.white).withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 16,
                    )
                  ],
                ),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildLegendDot('Lovers (1)', const Color(0xFFFF2D55)),
                      const SizedBox(width: 12),
                      _buildLegendDot('Close (5)', const Color(0xFFFFCC00)),
                      const SizedBox(width: 12),
                      _buildLegendDot('Family (10)', const Color(0xFF34C759)),
                      const SizedBox(width: 12),
                      _buildLegendDot('Friends (150)', const Color(0xFF5856D6)),
                      const SizedBox(width: 12),
                      _buildLegendDot('Network (1500)', const Color(0xFF64748B)),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildOrbitNodes(List<Contact> contacts, Offset centerOffset) {
    final Map<String, List<Contact>> grouped = {
      'lovers': contacts.where((c) => c.tier == 'lovers').toList(),
      'close_friends': contacts.where((c) => c.tier == 'close_friends').toList(),
      'family': contacts.where((c) => c.tier == 'family').toList(),
      'friends': contacts.where((c) => c.tier == 'friends').toList(),
      'acquaintances': contacts.where((c) => c.tier == 'acquaintances').toList(),
    };

    List<Widget> nodes = [];

    grouped.forEach((tierKey, list) {
      final config = DunbarTierData.configs[tierKey]!;
      final radius = config.radius;

      for (int i = 0; i < list.length; i++) {
        final contact = list[i];
        double posX;
        double posY;

        if (contact.dx != null && contact.dy != null) {
          posX = contact.dx!;
          posY = contact.dy!;
        } else {
          final angle = (i / math.max(list.length, 1)) * 2 * math.pi - math.pi / 2;
          posX = centerOffset.dx + radius * math.cos(angle) - 24;
          posY = centerOffset.dy + radius * math.sin(angle) - 24;
        }

        nodes.add(
          Positioned(
            left: posX,
            top: posY,
            child: GestureDetector(
              onTap: () => widget.onContactSelected(contact),
              onPanUpdate: (details) {
                context.read<ContactProvider>().updatePosition(
                      contact.id,
                      posX + details.delta.dx,
                      posY + details.delta.dy,
                    );
              },
              child: Tooltip(
                message: '${contact.name} (${config.name})',
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? const Color(0xFF1E293B)
                        : Colors.white,
                    border: Border.all(color: config.color, width: 2.5),
                    boxShadow: [
                      BoxShadow(
                        color: config.color.withValues(alpha: 0.35),
                        blurRadius: 12,
                        spreadRadius: 1,
                      )
                    ],
                  ),
                  child: ClipOval(
                    child: contact.avatarPath != null && File(contact.avatarPath!).existsSync()
                        ? Image.file(File(contact.avatarPath!), fit: BoxFit.cover)
                        : Center(
                            child: Text(
                              contact.initials,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: config.color,
                              ),
                            ),
                          ),
                  ),
                ),
              ),
            ),
          ),
        );
      }
    });

    return nodes;
  }

  Widget _buildLegendDot(String label, Color color) {
    return Row(
      children: [
        Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 5),
        Text(
          label,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
