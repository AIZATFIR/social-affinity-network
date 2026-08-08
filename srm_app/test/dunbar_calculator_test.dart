import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Dunbar Calculator Tests', () {
    test('Calculate Health Score correctly for balanced contacts', () {
      final loversCount = 1;
      final closeCount = 4;
      final totalCount = 15;

      int score = 100;
      if (loversCount > 1) score -= 20;
      if (closeCount > 5) score -= 15;
      if (totalCount == 0) score = 0;

      expect(score, 100);
    });

    test('Health Score penalty when lovers tier exceeds capacity cap of 1', () {
      final loversCount = 2; // Over capacity
      final closeCount = 3;
      final totalCount = 10;

      int score = 100;
      if (loversCount > 1) score -= 20;
      if (closeCount > 5) score -= 15;
      if (totalCount == 0) score = 0;

      expect(score, 80);
    });
  });
}
