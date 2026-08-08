import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/attitude_task.dart';
import '../../providers/contact_provider.dart';

class SubtaskChecklistWidget extends StatefulWidget {
  final String contactId;
  final List<AttitudeTask> tasks;

  const SubtaskChecklistWidget({
    super.key,
    required this.contactId,
    required this.tasks,
  });

  @override
  State<SubtaskChecklistWidget> createState() => _SubtaskChecklistWidgetState();
}

class _SubtaskChecklistWidgetState extends State<SubtaskChecklistWidget> {
  final TextEditingController _newTaskController = TextEditingController();
  bool _isAdding = false;

  @override
  void dispose() {
    _newTaskController.dispose();
    super.dispose();
  }

  void _submitNewTask() {
    final text = _newTaskController.text.trim();
    if (text.isNotEmpty) {
      context.read<ContactProvider>().addAttitudeTask(widget.contactId, text);
      _newTaskController.clear();
      setState(() {
        _isAdding = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Row(
              children: [
                Icon(Icons.check_circle_outline, size: 18, color: Color(0xFF0066CC)),
                SizedBox(width: 6),
                Text(
                  'How to Treat Them (Tasks)',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            Text(
              '${widget.tasks.where((t) => t.isDone).length}/${widget.tasks.length} Done',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Task Items List (Google Tasks Style)
        if (widget.tasks.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0),
            child: Text(
              'Belum ada instruksi. Klik "+ Tambah Poin" di bawah.',
              style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Colors.grey),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.tasks.length,
            separatorBuilder: (_, index) => const SizedBox(height: 4),
            itemBuilder: (context, index) {
              final task = widget.tasks[index];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E293B) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: task.isDone
                        ? const Color(0xFF34C759).withValues(alpha: 0.3)
                        : (isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0)),
                  ),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: Icon(
                        task.isDone ? Icons.check_circle : Icons.radio_button_unchecked,
                        color: task.isDone ? const Color(0xFF34C759) : Colors.grey,
                        size: 20,
                      ),
                      onPressed: () {
                        context
                            .read<ContactProvider>()
                            .toggleAttitudeTask(widget.contactId, task.id);
                      },
                    ),
                    Expanded(
                      child: Text(
                        task.text,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: task.isDone ? FontWeight.normal : FontWeight.w600,
                          decoration: task.isDone ? TextDecoration.lineThrough : null,
                          color: task.isDone
                              ? Colors.grey
                              : (isDark ? Colors.white : const Color(0xFF0F172A)),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, size: 16, color: Colors.grey),
                      onPressed: () {
                        context
                            .read<ContactProvider>()
                            .deleteAttitudeTask(widget.contactId, task.id);
                      },
                    ),
                  ],
                ),
              );
            },
          ),
        const SizedBox(height: 10),

        // "+ Add Item" Button (Google Tasks Style)
        if (_isAdding)
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _newTaskController,
                  autofocus: true,
                  style: const TextStyle(fontSize: 12),
                  decoration: InputDecoration(
                    hintText: 'Tambah poin tindakan...',
                    hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFF0066CC)),
                    ),
                  ),
                  onSubmitted: (_) => _submitNewTask(),
                ),
              ),
              const SizedBox(width: 6),
              IconButton(
                icon: const Icon(Icons.check, color: Color(0xFF0066CC)),
                onPressed: _submitNewTask,
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.grey),
                onPressed: () {
                  setState(() {
                    _isAdding = false;
                  });
                },
              ),
            ],
          )
        else
          InkWell(
            onTap: () {
              setState(() {
                _isAdding = true;
              });
            },
            borderRadius: BorderRadius.circular(12),
            child: const Padding(
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
              child: Row(
                children: [
                  Icon(Icons.add, size: 18, color: Color(0xFF0066CC)),
                  SizedBox(width: 6),
                  Text(
                    'Tambah Poin Tindakan',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0066CC),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
