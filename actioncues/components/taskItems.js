import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TaskItems = ({ title, id, isChecked, createdAt, dueDate, onDelete, onCheck, onEdit }) => {
  return (
    <View style={styles.taskItem}>
      {/* Edit Button */}
      <TouchableOpacity onPress={() => onEdit(id)}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      {/* Task Title (Clickable to toggle completion) */}
      <TouchableOpacity onPress={() => onCheck(id, isChecked)}>
        <Text style={{ ...styles.taskTitle, textDecorationLine: isChecked ? 'line-through' : 'none' }}>
          {title}
        </Text>
      </TouchableOpacity>

      {/* Due Date */}
      <Text style={styles.dueDate}>Due: {new Date(dueDate).toLocaleDateString()}</Text>

      {/* Created Date */}
      <Text style={styles.createdAt}>Created: {new Date(createdAt).toLocaleDateString()}</Text>

      {/* Delete Button */}
      <TouchableOpacity onPress={() => onDelete(id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: "gray",
  },
  createdAt: {
    fontSize: 14,
    color: "gray",
  },
  deleteText: {
    fontSize: 14,
    color: "red",
  },
  editText: {
    fontSize: 14,
    color: "blue",
    marginRight: 10,
  },
});

export default TaskItems;
