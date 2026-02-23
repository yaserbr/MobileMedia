import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const API_URL = "https://medialogger-6jne.onrender.com";

export default function Edit() {
  const router = useRouter();
  const params: any = useLocalSearchParams();

  const [title, setTitle] = useState(params.title || "");
  const [mediaType, setMediaType] = useState(params.mediaType || "");
  const [rating, setRating] = useState(params.rating || "");

  const id = params.id;

  /* ================= UPDATE ================= */

  const update = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          mediaType,
          rating: Number(rating),
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Entry updated successfully ✅");
        router.replace("/home");
      } else {
        Alert.alert("Error", "Update failed");
      }
    } catch {
      Alert.alert("Error", "Connection problem");
    }
  };

  /* ================= DELETE ================= */

  const remove = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this entry?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${API_URL}/api/entries/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              Alert.alert("Deleted", "Entry removed ✅");
              router.replace("/home");
            } else {
              Alert.alert("Error", "Delete failed");
            }
          } catch {
            Alert.alert("Error", "Connection problem");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#020B1C", "#071A3A", "#02040A"]}
        style={styles.background}
      />

      {/* Floating Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Glass Card */}
      <BlurView intensity={900} tint="dark" style={styles.card}>
        <Text style={styles.title}>Edit Entry</Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          value={mediaType}
          onChangeText={setMediaType}
          placeholder="Media Type"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rating}
          onChangeText={setRating}
          placeholder="Rating (1 - 5)"
          placeholderTextColor="#aaa"
        />

        {/* Update Button */}
        <TouchableOpacity style={styles.button} onPress={update}>
          <LinearGradient
            colors={["#4A7CFF", "#2951FF"]}
            style={styles.buttonInner}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity style={styles.button} onPress={remove}>
          <LinearGradient
            colors={["#FF4D6D", "#C9184A"]}
            style={styles.buttonInner}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 22,
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  shape: {
    position: "absolute",
    borderRadius: 300,
    opacity: 0.25,
  },

  shape1: {
    width: 220,
    height: 220,
    backgroundColor: "#4A7CFF",
    top: -70,
    left: -70,
  },

  shape2: {
    width: 180,
    height: 180,
    backgroundColor: "#9B6CFF",
    bottom: 120,
    right: -60,
  },

  shape3: {
    width: 140,
    height: 140,
    backgroundColor: "#00D4FF",
    top: height / 2,
    left: width / 2 - 70,
  },

  card: {
    width: width * 0.88,
    padding: 28,
    borderRadius: 28,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#4A7CFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 15,
    borderRadius: 14,
    marginBottom: 16,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
  },

  buttonInner: {
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});