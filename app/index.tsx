import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

const API_URL = "https://medialogger-6jne.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState("");

  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= DEEP LINK LISTENER ================= */

  useEffect(() => {
    const sub = Linking.addEventListener("url", async (event) => {
      if (event.url.startsWith("medialoggermobile://success")) {
        const token = event.url.split("token=")[1];

        if (token) {
          await AsyncStorage.setItem("token", token);
          router.replace("/home");
        }
      }
    });

    return () => sub.remove();
  }, []);

  /* ================= EMAIL LOGIN ================= */

  const login = async () => {
    if (!email || !password) {
      showToast("⚠️ Please enter all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok && data.token) {
        await AsyncStorage.setItem("token", data.token);
        router.replace("/home");
      } else {
        showToast(data.error || "❌ Login failed");
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
        <BlurView intensity={0} tint="dark" style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </BlurView>
      )}

      {/* Background */}
      <LinearGradient
        colors={["#020B1C", "#071A3A", "#09020a"]}
        style={styles.background}
      />

      {/* Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Glass Card */}
      <BlurView intensity={90} tint="dark" style={styles.card}>
        <View style={styles.cardOverlay}>
          {/* LOGO */}
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* ===== GLASS LOGIN BUTTON ===== */}
          <TouchableOpacity
            onPress={login}
            disabled={loading}
            activeOpacity={0.85}
            style={styles.glassBtn}
          >
            <BlurView intensity={120} tint="light" style={styles.glassInner}>
              <LinearGradient
                colors={["#0F1F4B", "#1E3A8A", "#2563EB"]}
                style={styles.glassGradient}
              />

              <View style={styles.glassHighlight} />

              <Text style={styles.glassText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* DIVIDER */}
          <Text style={styles.divider}>
            if you don't have an account{" "}
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Create one
            </Text>
          </Text>

          {/* SOCIAL BUTTONS */}
          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Image
                source={require("../assets/google.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Image
                source={require("../assets/github.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Image
                source={require("../assets/facebook.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  link: {
    color: "#4A7CFF",
    fontWeight: "700",
    textDecorationLine: "underline",
  },

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
    width: 150,
    height: 150,
    marginBottom: 30,
  },

  subtitle: {
    color: "#C7D2FF",
    marginBottom: 25,
    fontSize: 14,
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

  /* ===== Glass Button ===== */

  glassBtn: {
    width: "100%",
    borderRadius: 32,
    overflow: "hidden",
    marginTop: 10,

    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 120,
  },

  glassInner: {
    overflow: "hidden",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
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

  divider: {
    color: "#AAA",
    fontSize: 13,
    marginVertical: 18,
  },

  socials: {
    flexDirection: "row",
    justifyContent: "center",
  },

  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    marginHorizontal: 8,
  },

  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
});