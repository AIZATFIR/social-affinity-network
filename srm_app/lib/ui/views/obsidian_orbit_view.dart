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
    final bgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF5F5F7);

    const double canvasSize = 3600.0;
    const Offset centerOffset = Offset(canvasSize / 2, canvasSize / 2);

    return Container(
      width: double.infinity,
      height: double.infinity,
      color: bgColor,
      child: Stack(
        children: [
          // Infinite Seamless Theme Background Fill (No Container Box Edges)
          Positioned.fill(
            child: Container(color: bgColor),
          ),

          // Interactive Obsidian-Style Zoom, Pan & Drag Canvas
          InteractiveViewer(
            transformationController: _transformationController,
            minScale: 0.1,
            maxScale: 3.5,
            boundaryMargin: const EdgeInsets.all(3000),
            clipBehavior: Clip.none,
            child: Container(
              width: canvasSize,
              height: canvasSize,
              color: bgColor,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // CustomPaint for Concentric Rings & Grid Background
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

                  // Draggable Contact Orbit Nodes
                  ..._buildOrbitNodes(contacts, centerOffset),
                ],
              ),
            ),
          ),

          // Controls overlay: Reset Zoom Button
          Positioned(
            top: 16,
            right: 16,
            child: FloatingActionButton.small(
              onPressed: _resetZoom,
              backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
              foregroundColor: isDark ? Colors.white : const Color(0xFF0F172A),
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
          _DraggableContactNode(
            key: ValueKey(contact.id),
            contact: contact,
            config: config,
            initialX: posX,
            initialY: posY,
            centerOffset: centerOffset,
            onTap: () => widget.onContactSelected(contact),
            onDragEnd: (newX, newY, newTier) {
              final updated = contact.copyWith(
                dx: newX,
                dy: newY,
                tier: newTier,
              );
              context.read<ContactProvider>().updateContact(updated);
            },
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

class _DraggableContactNode extends StatefulWidget {
  final Contact contact;
  final DunbarTierConfig config;
  final double initialX;
  final double initialY;
  final Offset centerOffset;
  final VoidCallback onTap;
  final Function(double newX, double newY, String newTier) onDragEnd;

  const _DraggableContactNode({
    super.key,
    required this.contact,
    required this.config,
    required this.initialX,
    required this.initialY,
    required this.centerOffset,
    required this.onTap,
    required this.onDragEnd,
  });

  @override
  State<_DraggableContactNode> createState() => _DraggableContactNodeState();
}

class _DraggableContactNodeState extends State<_DraggableContactNode> {
  late double _currentX;
  late double _currentY;
  bool _isDragging = false;

  @override
  void initState() {
    super.initState();
    _currentX = widget.initialX;
    _currentY = widget.initialY;
  }

  @override
  void didUpdateWidget(covariant _DraggableContactNode oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_isDragging) {
      _currentX = widget.initialX;
      _currentY = widget.initialY;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Positioned(
      left: _currentX,
      top: _currentY,
      child: GestureDetector(
        onTap: widget.onTap,
        onPanStart: (_) {
          setState(() {
            _isDragging = true;
          });
        },
        onPanUpdate: (details) {
          setState(() {
            _currentX += details.delta.dx;
            _currentY += details.delta.dy;
          });
        },
        onPanEnd: (_) {
          setState(() {
            _isDragging = false;
          });

          // Calculate distance from center to auto-reassign Dunbar tier
          final dxFromCenter = _currentX + 24 - widget.centerOffset.dx;
          final dyFromCenter = _currentY + 24 - widget.centerOffset.dy;
          final dist = math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter);

          String newTier = 'acquaintances';
          if (dist <= 180) {
            newTier = 'lovers';
          } else if (dist <= 340) {
            newTier = 'close_friends';
          } else if (dist <= 520) {
            newTier = 'family';
          } else if (dist <= 780) {
            newTier = 'friends';
          } else {
            newTier = 'acquaintances';
          }

          widget.onDragEnd(_currentX, _currentY, newTier);
        },
        child: Tooltip(
          message: '${widget.contact.name} (${widget.config.name})',
          child: AnimatedScale(
            scale: _isDragging ? 1.25 : 1.0,
            duration: const Duration(milliseconds: 150),
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                border: Border.all(color: widget.config.color, width: 2.5),
                boxShadow: [
                  BoxShadow(
                    color: widget.config.color.withValues(alpha: _isDragging ? 0.6 : 0.35),
                    blurRadius: _isDragging ? 20 : 12,
                    spreadRadius: _isDragging ? 3 : 1,
                  )
                ],
              ),
              child: ClipOval(
                child: widget.contact.avatarPath != null && File(widget.contact.avatarPath!).existsSync()
                    ? Image.file(File(widget.contact.avatarPath!), fit: BoxFit.cover)
                    : Center(
                        child: Text(
                          widget.contact.initials,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: widget.config.color,
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
}
