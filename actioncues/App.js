import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import {
  app,
  db,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
} from "./firebase/index";
import TaskItems from "./components/taskItems";

export default function App() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // State for due date input
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Flag to check if we're editing a task
  const [editingTaskId, setEditingTaskId] = useState(null); // Store the id of the task being edited

  // Add a new task
  const addTask = async () => {
    if (!title.trim()) {
      console.log("Task title is empty. Cannot add task.");
      return;
    }

    // Check if a due date is set
    if (!dueDate.trim()) {
      Alert.alert("Validation Error", "Please set a due date for the task.");
      return;
    }

    try {
      console.log("Adding task:", { title, dueDate });
      const docRef = await addDoc(collection(db, "tasks"), {
        title: title,
        isChecked: false,
        createdAt: new Date(),
        dueDate: dueDate, // Save the due date as string
      });
      console.log("Document written with ID: ", docRef.id);
      setTitle(""); // Reset input
      setDueDate(""); // Reset due date input
      fetchTasks(); // Refresh tasks
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Edit an existing task
  const editTask = async (taskId, newTitle, newDueDate) => {
    if (!newTitle.trim()) {
      Alert.alert("Validation Error", "Please enter a valid task title.");
      return;
    }

    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { title: newTitle, dueDate: newDueDate });
      fetchTasks();
      setIsEditing(false); // Turn off editing mode
      setEditingTaskId(null); // Clear the task ID being edited
      setTitle(""); // Reset input
      setDueDate(""); // Reset due date input
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  // Fetch tasks from Firebase
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

  // Delete a specific task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion status
  const toggleCheck = async (taskId, currentStatus) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, { isChecked: !currentStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task check status:", error);
    }
  };

  // Delete all tasks
  const deleteAllTasks = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      setTasks([]);
      console.log("All tasks deleted successfully!");
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("./assets/Actioncues.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Header Section */}
      <View style={styles.header}>
        {/* Task count */}
        <Text style={styles.noTask}>{tasks.length} Tasks</Text>
        <Pressable onPress={deleteAllTasks}>
          <Text style={styles.deleteText}>Delete All Tasks</Text>
        </Pressable>
      </View>

      {/* Task List */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItems
              title={item.title}
              id={item.id}
              isChecked={item.isChecked}
              createdAt={item.createdAt?.toDate()}
              dueDate={item.dueDate} // Display due date as string
              onDelete={deleteTask}
              onCheck={toggleCheck}
              onEdit={() => {
                setIsEditing(true);
                setEditingTaskId(item.id);
                setTitle(item.title);
                setDueDate(item.dueDate);
              }}
            />
          )}
          style={styles.taskList}
        />
      ) : (
        <Text style={styles.noTaskText}>No tasks available</Text>
      )}

      {/* Input Section */}
      {/* Due Date Input */}
      <TextInput
        placeholder="Enter due date (YYYY-MM-DD)"
        style={styles.input}
        value={dueDate}
        onChangeText={(text) => setDueDate(text)} // Update dueDate state on text change
      />

      {/* Task Title Input */}
      <TextInput
        placeholder="Enter new Task"
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />

      {/* Add/Edit Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (isEditing) {
            editTask(editingTaskId, title, dueDate); // Edit existing task
          } else {
            addTask(); // Add new task
          }
        }}
      >
        <Text style={styles.addButtonText}>
          {isEditing ? "Save Changes" : "Add Task"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  logo: {
    position: "absolute",
    left: 10,
    top: 10,
    width: 100,
    height: 100,
  },
  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  noTask: {
    fontSize: 15,
    fontWeight: "500",
    marginRight: 20,
    color: "red",
  },
  noTaskText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  input: {
    backgroundColor: "lightgray",
    padding: 10,
    fontSize: 17,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  deleteText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "red",
  },
  taskList: {
    marginTop: 20,
  },
});
