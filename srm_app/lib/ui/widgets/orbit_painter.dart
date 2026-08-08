import 'package:flutter/material.dart';

class OrbitPainter extends CustomPainter {
  final bool isDark;

  OrbitPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);

    final rings = [
      {'radius': 120.0, 'color': const Color(0xFFFF2D55), 'label': 'Lovers (1)'},
      {'radius': 240.0, 'color': const Color(0xFFFFCC00), 'label': 'Close Friends (5)'},
      {'radius': 380.0, 'color': const Color(0xFF34C759), 'label': 'Keluarga (10)'},
      {'radius': 560.0, 'color': const Color(0xFF5856D6), 'label': 'Teman (30)'},
      {'radius': 800.0, 'color': const Color(0xFF64748B), 'label': 'Kenalan (1500)'},
    ];

    final gridPaint = Paint()
      ..color = isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.03)
      ..strokeWidth = 1.0;

    // Draw ambient grid lines
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

      final paint = Paint()
        ..color = color.withOpacity(isDark ? 0.25 : 0.2)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;

      final fillPaint = Paint()
        ..color = color.withOpacity(isDark ? 0.03 : 0.02)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(center, radius, fillPaint);
      canvas.drawCircle(center, radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
