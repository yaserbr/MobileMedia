import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

const API_URL = "https://medialogger-6jne.onrender.com";

export default function Add() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /* ================= ADD ENTRY ================= */

  const addEntry = async () => {
    if (!title || !rating) {
      Alert.alert("Error", "Please enter all fields");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          mediaType: type,
          rating: Number(rating),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Entry added successfully ✅");
        router.back();
      } else {
        Alert.alert("Error", data.error || "Failed to add entry");
      }
    } catch {
      Alert.alert("Connection Error", "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={["#0A1A3C", "#050B1A", "#02040A"]}
        style={styles.background}
      />

      {/* Floating Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Glass Card */}
      <BlurView intensity={90} tint="dark" style={styles.card}>
        <Text style={styles.title}>Add New Media</Text>

        {/* Input */}
        <TextInput
          placeholder="Movie or Book Title"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        {/* Picker */}
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={type}
            onValueChange={(v) => setType(v)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="🎬 Movie" value="movie" />
            <Picker.Item label="📘 Book" value="book" />
          </Picker>
        </View>

        {/* Rating */}
        <TextInput
          placeholder="Rating (1 - 5)"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={addEntry}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#4A7CFF", "#2951FF"]}
            style={styles.buttonInner}
          >
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "Add"}
            </Text>
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
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  /* ===== Floating Shapes ===== */

  shape: {
    position: "absolute",
    borderRadius: 300,
    opacity: 0.25,
    backgroundColor: "#4A7CFF",
  },

  shape1: {
    width: 220,
    height: 220,
    top: -60,
    left: -60,
  },

  shape2: {
    width: 180,
    height: 180,
    bottom: 100,
    right: -50,
    backgroundColor: "#9B6CFF",
  },

  shape3: {
    width: 140,
    height: 140,
    top: height / 2,
    left: width / 2 - 70,
    backgroundColor: "#00D4FF",
  },

  /* ===== Glass Card ===== */

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
    marginBottom: 28,
    letterSpacing: 0.5,
  },

  /* ===== Inputs ===== */

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 15,
    borderRadius: 14,
    marginBottom: 16,

    color: "white",
    fontSize: 15,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  pickerBox: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",

    overflow: "hidden",
  },

  picker: {
    color: "white",
    height: 52,
  },

  /* ===== Button ===== */

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
    letterSpacing: 0.4,
  },
});