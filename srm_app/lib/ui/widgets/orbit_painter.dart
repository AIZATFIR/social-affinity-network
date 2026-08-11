import 'package:flutter/material.dart';

class OrbitPainter extends CustomPainter {
  final bool isDark;

  OrbitPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    // Full canvas background fill so zero borders show when zooming out
    final bgPaint = Paint()
      ..color = isDark ? const Color(0xFF0F172A) : const Color(0xFFF5F5F7);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bgPaint);

    final rings = [
      {'radius': 120.0, 'color': const Color(0xFFFF2D55), 'label': 'Lovers (1)'},
      {'radius': 260.0, 'color': const Color(0xFFFFCC00), 'label': 'Close Friends (5)'},
      {'radius': 420.0, 'color': const Color(0xFF34C759), 'label': 'Keluarga (10)'},
      {'radius': 640.0, 'color': const Color(0xFF5856D6), 'label': 'Teman (150)'},
      {'radius': 960.0, 'color': const Color(0xFF64748B), 'label': 'Kenalan (1500)'},
    ];

    final gridPaint = Paint()
      ..color = isDark ? Colors.white.withValues(alpha: 0.05) : Colors.black.withValues(alpha: 0.04)
      ..strokeWidth = 1.0;

    // Draw ambient grid lines extending to 3600px
    const double step = 60.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Draw concentric orbit rings
    for (var ring in rings) {
      final radius = ring['radius'] as double;
      final color = ring['color'] as Color;

      final ringPaint = Paint()
        ..color = color.withValues(alpha: isDark ? 0.3 : 0.25)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0;

      final fillPaint = Paint()
        ..color = color.withValues(alpha: isDark ? 0.04 : 0.03)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(center, radius, fillPaint);
      canvas.drawCircle(center, radius, ringPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
