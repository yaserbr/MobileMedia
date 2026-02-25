import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
  const [toast, setToast] = useState("");

  const router = useRouter();

  /* ================= ADD ENTRY ================= */

  const showToast = (msg: string): void => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const addEntry = async () => {
    if (!title || !rating) {
      showToast("⚠️ Please enter title and rating");
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
        showToast("✅ Entry added successfully");
        setTimeout(() => router.back(), 800);
      } else {
        showToast(data.error || "❌ Failed to add entry");
      }
    } catch {
      showToast("🌐 Server connection error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* Toast */}
      {toast !== "" && (
        <BlurView intensity={0} tint="dark" style={[styles.toast,{ borderRadius: 28 }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </BlurView>
      )}

      {/* Background */}
      <LinearGradient
        colors={["#0A1A3C", "#050B1A", "#02040A"]}
        style={styles.background}
      />

      {/* Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Glass Card */}
      <BlurView intensity={0} tint="dark" style={[styles.card, { borderRadius: 18 }]}>
        <Text style={styles.title}>Add New Media 🎬📘</Text>

        {/* Title */}
        <TextInput
          placeholder="🎯 Movie or Book Title"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        {/* Type */}
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
          placeholder="⭐ Rating (1 - 5)"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        {/* Glass Button */}
        <TouchableOpacity
          onPress={addEntry}
          disabled={loading}
          activeOpacity={0.85}
          style={styles.glassBtn}
        >
          <BlurView intensity={120} tint="light" style={[styles.glassInner, { borderRadius: 18 }]}>
            {/* Blue Gradient */}
            <LinearGradient
              colors={["#0F1F4B", "#1E3A8A", "#2563EB"]}
              style={styles.glassGradient}
            />

            {/* Highlight */}
            <View style={styles.glassHighlight} />

            <Text style={styles.glassText}>
              {loading ? "⏳ Saving..." : "💾 Add Entry"}
            </Text>
          </BlurView>
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

  /* ===== Toast ===== */

  toast: {
    position: "absolute",
    top: 60,

    width: width * 0.85,

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 18,

    backgroundColor: "rgba(255,255,255,0.12)",

    borderWidth: 1,

    zIndex: 100,
  },

  toastText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  /* ===== Shapes ===== */

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

  /* ===== Card ===== */

  card: {
    width: width * 0.88,
    padding: 28,
    borderRadius: 18,
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    shadowColor: "#4A7CFF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },

  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 25,
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

  /* ===== Glass Button ===== */

  glassBtn: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    marginTop: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 120,
  },

  glassInner: {
    overflow: "hidden",
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 0,
    borderColor: "rgba(255,255,255,0.4)",
  },

  glassGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  glassHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",

  },

  glassText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});