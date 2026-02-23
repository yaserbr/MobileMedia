import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const API_URL = "https://medialogger-6jne.onrender.com";

export default function Home() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    loadEntries();
  }, []);

  /* ================= LOAD ================= */

  const loadEntries = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/entries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setEntries(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteEntry = async (id: string) => {
    Alert.alert("Confirm", "Delete this item?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            await fetch(`${API_URL}/api/entries/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            loadEntries();
          } catch {
            Alert.alert("Error", "Delete failed");
          }
        },
      },
    ]);
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  /* ================= ITEM ================= */

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/edit",
          params: { id: item._id },
        })
      }
      onLongPress={() => deleteEntry(item._id)}
      activeOpacity={0.85}
    >
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.row}>
        <Text style={styles.type}>{item.mediaType}</Text>
        <Text style={styles.rating}>⭐ {item.rating}/5</Text>
      </View>

      <Text style={styles.hint}>Tap to edit • Hold to delete</Text>
    </TouchableOpacity>
  );

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#020B1C", "#071A3A", "#02040A"]}
        style={styles.background}
      />

      {/* Shapes */}
      <View style={[styles.shape, styles.shape1]} />
      <View style={[styles.shape, styles.shape2]} />
      <View style={[styles.shape, styles.shape3]} />

      {/* Header */}
      <BlurView intensity={300} tint="dark" style={styles.header}>
        <Text style={styles.logo}>MediaLogger</Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </BlurView>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4A7CFF"
          style={{ marginTop: 40 }}
        />
      ) : entries.length === 0 ? (
        <Text style={styles.empty}>No entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 140 }}
          refreshing={loading}
          onRefresh={loadEntries}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add")}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={["#4A7CFF", "#2951FF"]}
          style={styles.fabInner}
        >
          <Text style={styles.fabText}>＋</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  /* ===== Shapes ===== */

  shape: {
    position: "absolute",
    borderRadius: 300,
    opacity: 0.25,
    backgroundColor: "#4A7CFF",
  },

  shape1: {
    width: 240,
    height: 240,
    top: -80,
    left: -80,
  },

  shape2: {
    width: 200,
    height: 200,
    bottom: 120,
    right: -70,
    backgroundColor: "#9B6CFF",
  },

  shape3: {
    width: 150,
    height: 150,
    top: height / 2,
    left: width / 2 - 70,
    backgroundColor: "#00D4FF",
  },

  /* ===== Header ===== */

  header: {
    marginTop: 45,
    marginHorizontal: 18,
    marginBottom: 10,

    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 22,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
  },

  logo: {
    color: "white",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  logout: {
    color: "#c46bff",
    fontWeight: "600",
  },

  /* ===== Cards ===== */

  card: {
    marginHorizontal: 18,
    marginTop: 14,

    padding: 18,
    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    shadowColor: "#4A7CFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,

    elevation: 10,
  },

  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  type: {
    color: "#C7D2FF",
    fontSize: 13,
  },

  rating: {
    color: "#FFD166",
    fontSize: 13,
  },

  hint: {
    marginTop: 10,
    fontSize: 11,
    color: "#AAA",
  },

  empty: {
    color: "#DDD",
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },

  /* ===== FAB ===== */

  fab: {
    position: "absolute",
    right: 25,
    bottom: 35,

    width: 66,
    height: 66,
    borderRadius: 35,

    overflow: "hidden",

    shadowColor: "#4A7CFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,

    elevation: 12,
  },

  fabInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fabText: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },
});