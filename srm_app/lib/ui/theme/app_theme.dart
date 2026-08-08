import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF0066CC);
  static const Color accentAmber = Color(0xFFFFCC00);
  static const Color loversPink = Color(0xFFFF2D55);
  static const Color familyGreen = Color(0xFF34C759);
  static const Color friendsPurple = Color(0xFF5856D6);
  static const Color networkSlate = Color(0xFF64748B);

  static const Color bgParchmentLight = Color(0xFFF5F5F7);
  static const Color bgDarkSpace = Color(0xFF0F172A);
  static const Color cardDark = Color(0xFF1E293B);

  static ThemeData lightTheme() {
    final baseText = GoogleFonts.plusJakartaSansTextTheme();
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: bgParchmentLight,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: accentAmber,
        surface: Colors.white,
      ),
      textTheme: baseText.copyWith(
        titleLarge: baseText.titleLarge?.copyWith(fontWeight: FontWeight.w800, color: const Color(0xFF0F172A)),
        titleMedium: baseText.titleMedium?.copyWith(fontWeight: FontWeight.w700, color: const Color(0xFF0F172A)),
        bodyMedium: baseText.bodyMedium?.copyWith(color: const Color(0xFF334155)),
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
    );
  }

  static ThemeData darkTheme() {
    final baseText = GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme);
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDarkSpace,
      colorScheme: const ColorScheme.dark(
        primary: primaryBlue,
        secondary: accentAmber,
        surface: cardDark,
      ),
      textTheme: baseText.copyWith(
        titleLarge: baseText.titleLarge?.copyWith(fontWeight: FontWeight.w800, color: Colors.white),
        titleMedium: baseText.titleMedium?.copyWith(fontWeight: FontWeight.w700, color: Colors.white),
        bodyMedium: baseText.bodyMedium?.copyWith(color: const Color(0xFF94A3B8)),
      ),
      cardTheme: CardThemeData(
        color: cardDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: Color(0xFF334155)),
        ),
      ),
    );
  }
}
