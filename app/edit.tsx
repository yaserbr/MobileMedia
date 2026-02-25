import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
  const [mediaType, setMediaType] = useState(params.mediaType || "movie");
  const [rating, setRating] = useState(params.rating || "");

  // Toast
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const id = params.id;

  /* ================= UPDATE ================= */

  const update = async () => {
    /* Validation */

    if (!title.trim()) {
      showToast("⚠️ Title is required");
      return;
    }

    if (!rating) {
      showToast("⚠️ Rating is required");
      return;
    }

    const rate = Number(rating);

    if (isNaN(rate) || rate < 1 || rate > 5) {
      showToast("⭐ Rating must be between 1 and 5");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showToast("🔒 Session expired, login again");
        return;
      }

      const res = await fetch(`${API_URL}/api/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          mediaType,
          rating: rate,
        }),
      });

      if (res.ok) {
        showToast("✅ Entry updated successfully");
        setTimeout(() => router.replace("/home"), 800);
      } else {
        showToast("❌ Failed to save changes");
      }
    } catch {
      showToast("🌐 Server connection problem");
    }
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* Toast */}
      {toast !== "" && (
        <BlurView intensity={0} tint="dark" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </BlurView>
      )}

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

        {/* Title */}
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#aaa"
        />

        {/* Media Type Picker */}
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={mediaType}
            onValueChange={(v) => setMediaType(v)}
            style={styles.picker}
            dropdownIconColor="white"
          >
            <Picker.Item label="🎬 Movie" value="movie" />
            <Picker.Item label="📘 Book" value="book" />
          </Picker>
        </View>

        {/* Rating */}
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

  /* Picker */

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
    borderColor: "rgba(255,255,255,0.15)",

    zIndex: 100,
  },

  toastText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});