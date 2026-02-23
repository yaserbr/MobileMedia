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
} from "react-native";
WebBrowser.maybeCompleteAuthSession();

const API_URL = "https://medialogger-6jne.onrender.com";
const REDIRECT_URL = "medialoggermobile://success";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
      Alert.alert("خطأ", "أدخل جميع البيانات");
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
        Alert.alert("خطأ", data.error || "فشل تسجيل الدخول");
      }
    } catch {
      Alert.alert("مشكلة", "فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */

  const loginWithGoogle = async () => {
    const redirectUrl = Linking.createURL("success");

    const result = await WebBrowser.openAuthSessionAsync(
      `${API_URL}/auth/google?mobile=1`,
      redirectUrl
    );

    if (result.type === "success" && result.url) {
      const token = result.url.split("token=")[1];

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.replace("/home");
      }
    }
  };

  const loginWithFacebook = () => {
    Alert.alert("قريبًا", "تسجيل الدخول عبر فيسبوك لاحقًا 🚀");
  };

  const loginWithGithub = () => {
    Alert.alert("قريبًا", "تسجيل الدخول عبر Github لاحقًا 🚀");
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* BACKGROUND BLOBS */}
      <View style={styles.blobBlue} />
      <View style={styles.blobCyan} />
      <View style={styles.blobWhite} />

      {/* GRADIENT */}
      <View style={styles.gradient} />

      {/* GLASS CARD */}
      <BlurView intensity={70} tint="light" style={styles.card}>
        <View style={styles.cardOverlay}>
          {/* LOGO */}
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitle}>Sign In</Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#cdd6ff"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#cdd6ff"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={login}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#0e1f40", "#1a3fa0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? "جاري الدخول..." : "Sign in"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* DIVIDER */}
          <Text style={styles.divider}>Orrrrrrr</Text>

          {/* SOCIAL BUTTONS */}
          <View style={styles.socials}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={loginWithGoogle}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/google.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={loginWithGithub}
              activeOpacity={0.7}
            >
              <Image
                source={require("../assets/github.png")}
                style={styles.socialIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialBtn}
              onPress={loginWithFacebook}
              activeOpacity={0.7}
            >
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#081f4d",
  },

  /* BLOBS */

  blobBlue: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "rgba(0,120,255,0.35)",
    top: -150,
    left: -150,
  },

  blobCyan: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "rgba(0,255,221,0.45)",
    bottom: -120,
    right: -120,
  },

  blobWhite: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: "35%",
    left: "55%",
  },

  /* GRADIENT */

  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0e4cd2",
    opacity: 0.4,
  },

  /* CARD */

  card: {
    width: 340,
    padding: 0,
    borderRadius: 24,
    alignItems: "center",
    overflow: "hidden",
  },

  cardOverlay: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(11,47,111,0.6)",
    borderRadius: 24,
    padding: 25,
  },

  logo: {
    width: 170,
    height: 170,
    marginBottom: 35,
  },

  subtitle: {
    textAlign: "center",
    color: "#cdd6ff",
    marginBottom: 25,
    fontSize: 14,
  },

  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    color: "white",
    fontSize: 15,
  },

  button: {
    width: 290,
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  divider: {
    color: "#cdd6ff",
    fontSize: 13,
    marginVertical: 15,
    textAlign: "center",
  },

  socials: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },

  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 8,
  },

  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
});
