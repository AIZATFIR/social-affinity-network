import 'attitude_task.dart';

class Contact {
  final String id;
  String name;
  String? avatarPath;
  String avatarSymbol;
  String initials;
  String tier;
  String phone;
  String instagram;
  String notes;
  List<AttitudeTask> attitudeTasks;
  double? dx;
  double? dy;
  DateTime createdAt;

  Contact({
    required this.id,
    required this.name,
    this.avatarPath,
    this.avatarSymbol = 'person',
    required this.initials,
    required this.tier,
    this.phone = '',
    this.instagram = '',
    this.notes = '',
    required this.attitudeTasks,
    this.dx,
    this.dy,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'avatarPath': avatarPath,
        'avatarSymbol': avatarSymbol,
        'initials': initials,
        'tier': tier,
        'phone': phone,
        'instagram': instagram,
        'notes': notes,
        'attitudeTasks': attitudeTasks.map((t) => t.toJson()).toList(),
        'dx': dx,
        'dy': dy,
        'createdAt': createdAt.toIso8601String(),
      };

  factory Contact.fromJson(Map<String, dynamic> json) => Contact(
        id: json['id'] as String,
        name: json['name'] as String,
        avatarPath: json['avatarPath'] as String?,
        avatarSymbol: json['avatarSymbol'] as String? ?? 'person',
        initials: json['initials'] as String? ?? _extractInitials(json['name'] as String),
        tier: json['tier'] as String? ?? 'friends',
        phone: json['phone'] as String? ?? '',
        instagram: json['instagram'] as String? ?? '',
        notes: json['notes'] as String? ?? '',
        attitudeTasks: (json['attitudeTasks'] as List<dynamic>?)
                ?.map((t) => AttitudeTask.fromJson(t as Map<String, dynamic>))
                .toList() ??
            [],
        dx: (json['dx'] as num?)?.toDouble(),
        dy: (json['dy'] as num?)?.toDouble(),
        createdAt: json['createdAt'] != null
            ? DateTime.parse(json['createdAt'] as String)
            : DateTime.now(),
      );

  static String _extractInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.isEmpty ? 'C' : name.substring(0, name.length >= 2 ? 2 : 1).toUpperCase();
  }

  Contact copyWith({
    String? id,
    String? name,
    String? avatarPath,
    String? avatarSymbol,
    String? initials,
    String? tier,
    String? phone,
    String? instagram,
    String? notes,
    List<AttitudeTask>? attitudeTasks,
    double? dx,
    double? dy,
    DateTime? createdAt,
  }) {
    return Contact(
      id: id ?? this.id,
      name: name ?? this.name,
      avatarPath: avatarPath ?? this.avatarPath,
      avatarSymbol: avatarSymbol ?? this.avatarSymbol,
      initials: initials ?? this.initials,
      tier: tier ?? this.tier,
      phone: phone ?? this.phone,
      instagram: instagram ?? this.instagram,
      notes: notes ?? this.notes,
      attitudeTasks: attitudeTasks ?? List.from(this.attitudeTasks),
      dx: dx ?? this.dx,
      dy: dy ?? this.dy,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
