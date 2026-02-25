import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const API_URL = "https://medialogger-6jne.onrender.com";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= REGISTER ================= */

  const register = async () => {
    if (!username || !email || !password) {
      showToast("⚠️ Please fill all fields");
      return;
    }

    if (password.length < 6) {
      showToast("🔒 Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        showToast("✅ Account created successfully");

        if (data.token) {
          await AsyncStorage.setItem("token", data.token);
          router.replace("/home");
        } else {
          setTimeout(() => router.replace("/"), 800);
        }
      } else {
        showToast(data.error || "❌ Registration failed");
      }
    } catch {
      showToast("🌐 Server connection failed");
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
        colors={["#020B1C", "#071A3A", "#02040A"]}
        style={styles.background}
      />

      {/* Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Glass Card */}
      <BlurView intensity={90} tint="dark" style={styles.card}>
        <View style={styles.cardOverlay}>
          {/* Logo */}
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>

          {/* Username */}
          <TextInput
            placeholder="Username"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password */}
          <TextInput
            placeholder="Password (min 6 chars)"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* Register Button */}
          <TouchableOpacity
            onPress={register}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.button}
          >
            <LinearGradient
              colors={["#4A7CFF", "#2951FF"]}
              style={styles.buttonInner}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creating..." : "Register"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={() => router.replace("/")}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
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

  /* Shapes */

  shape: {
    position: "absolute",
    borderRadius: 300,
    opacity: 0.25,
  },

  shape1: {
    width: 240,
    height: 240,
    backgroundColor: "#4A7CFF",
    top: -80,
    left: -80,
  },

  shape2: {
    width: 200,
    height: 200,
    backgroundColor: "#9B6CFF",
    bottom: 120,
    right: -70,
  },

  shape3: {
    width: 150,
    height: 150,
    backgroundColor: "#00D4FF",
    top: height / 2,
    left: width / 2 - 70,
  },

  /* Card */

  card: {
    width: width * 0.88,
    borderRadius: 28,
    overflow: "hidden",
  },

  cardOverlay: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  logo: {
    width: 130,
    height: 130,
    marginBottom: 25,
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

  /* Button */

  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 15,
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

  loginText: {
    color: "#AAA",
    fontSize: 13,
  },

  loginLink: {
    color: "#4A7CFF",
    fontWeight: "600",
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