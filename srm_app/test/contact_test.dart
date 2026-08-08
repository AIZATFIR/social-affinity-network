import 'package:flutter_test/flutter_test.dart';

class AttitudeTask {
  final String id;
  final String text;
  bool isDone;

  AttitudeTask({
    required this.id,
    required this.text,
    this.isDone = false,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'text': text,
    'isDone': isDone,
  };

  factory AttitudeTask.fromJson(Map<String, dynamic> json) => AttitudeTask(
    id: json['id'] as String,
    text: json['text'] as String,
    isDone: json['isDone'] as bool? ?? false,
  );
}

void main() {
  group('Contact SubTask Unit Tests (Google Tasks Style)', () {
    test('AttitudeTask toggle completion state', () {
      final task = AttitudeTask(id: 't1', text: 'Tanyakan kabar harian');
      expect(task.isDone, false);

      task.isDone = true;
      expect(task.isDone, true);
    });

    test('AttitudeTask JSON serialization and deserialization', () {
      final task = AttitudeTask(id: 't2', text: 'Apresiasi usaha kecil', isDone: true);
      final json = task.toJson();

      expect(json['id'], 't2');
      expect(json['text'], 'Apresiasi usaha kecil');
      expect(json['isDone'], true);

      final deserialized = AttitudeTask.fromJson(json);
      expect(deserialized.id, 't2');
      expect(deserialized.text, 'Apresiasi usaha kecil');
      expect(deserialized.isDone, true);
    });
  });
}
