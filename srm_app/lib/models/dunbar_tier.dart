import 'package:flutter/material.dart';
import 'attitude_task.dart';

enum DunbarTierKey { lovers, closeFriends, family, friends, acquaintances }

class DunbarTierConfig {
  final String key;
  final String name;
  final Color color;
  final int recMax;
  final String iconSymbol;
  final double radius;
  final String description;
  final List<AttitudeTask> defaultTasks;

  const DunbarTierConfig({
    required this.key,
    required this.name,
    required this.color,
    required this.recMax,
    required this.iconSymbol,
    required this.radius,
    required this.description,
    required this.defaultTasks,
  });
}

class DunbarTierData {
  static final Map<String, DunbarTierConfig> configs = {
    'lovers': DunbarTierConfig(
      key: 'lovers',
      name: 'Lovers / Pasangan',
      color: const Color(0xFFFF2D55),
      recMax: 1,
      iconSymbol: 'favorite',
      radius: 120.0,
      description: 'Ikatan Paling Dekat (Kapasitas: 1)',
      defaultTasks: [
        AttitudeTask(id: 't1', text: 'Tanyakan kabar harian & dengarkan tanpa menyela'),
        AttitudeTask(id: 't2', text: 'Apresiasi usaha kecil & berikan dukungan emosional'),
        AttitudeTask(id: 't3', text: 'Agendakan quality time setiap akhir pekan'),
      ],
    ),
    'close_friends': DunbarTierConfig(
      key: 'close_friends',
      name: 'Close Friends',
      color: const Color(0xFFFFCC00),
      recMax: 5,
      iconSymbol: 'verified',
      radius: 240.0,
      description: 'Lingkaran Kepercayaan Mendalam (Kapasitas: 5)',
      defaultTasks: [
        AttitudeTask(id: 't4', text: 'Saling dukung saat masa sulit & bersikap jujur'),
        AttitudeTask(id: 't5', text: 'Luangkan waktu nongkrong / mabar berkala'),
        AttitudeTask(id: 't6', text: 'Saling bantu dalam project pribadi'),
      ],
    ),
    'family': DunbarTierConfig(
      key: 'family',
      name: 'Keluarga',
      color: const Color(0xFF34C759),
      recMax: 10,
      iconSymbol: 'home',
      radius: 380.0,
      description: 'Lingkaran Kekerabatan (Kapasitas: 10)',
      defaultTasks: [
        AttitudeTask(id: 't7', text: 'Komunikasi berkala & tunjukkan rasa hormat'),
        AttitudeTask(id: 't8', text: 'Bantu kebutuhan urusan rumah tangga'),
        AttitudeTask(id: 't9', text: 'Rencanakan kumpul keluarga di hari besar'),
      ],
    ),
    'friends': DunbarTierConfig(
      key: 'friends',
      name: 'Teman',
      color: const Color(0xFF5856D6),
      recMax: 30,
      iconSymbol: 'groups',
      radius: 560.0,
      description: 'Lingkaran Sosialisasi Aktif (Kapasitas: 30)',
      defaultTasks: [
        AttitudeTask(id: 't10', text: 'Menjaga sopan santun & ramah saat bertemu'),
        AttitudeTask(id: 't11', text: 'Ikut serta dalam kegiatan kelompok / komunitas'),
      ],
    ),
    'acquaintances': DunbarTierConfig(
      key: 'acquaintances',
      name: 'Kenalan',
      color: const Color(0xFF64748B),
      recMax: 1500,
      iconSymbol: 'person_outline',
      radius: 800.0,
      description: 'Jaringan Luar / Professional Network (Kapasitas: 1500)',
      defaultTasks: [
        AttitudeTask(id: 't12', text: 'Menjaga etika profesional & saling sapa'),
        AttitudeTask(id: 't13', text: 'Bertukar informasi profesional / LinkedIn'),
      ],
    ),
  };
}
