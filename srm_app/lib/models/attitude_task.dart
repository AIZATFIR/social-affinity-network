class AttitudeTask {
  final String id;
  String text;
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

  AttitudeTask copyWith({String? id, String? text, bool? isDone}) {
    return AttitudeTask(
      id: id ?? this.id,
      text: text ?? this.text,
      isDone: isDone ?? this.isDone,
    );
  }
}
