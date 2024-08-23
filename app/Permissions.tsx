import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import * as ExpoMediaLibrary from "expo-media-library";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ICON_SIZE = 26;
const Permissions = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ExpoMediaLibrary.usePermissions();

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permission);
  };

  const requestMicrophonePermission = async () => {
    const permission = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permission);
  };

  const handleContinue = async () => {
    const permission = await Camera.requestMicrophonePermission();
    setMicrophonePermissionStatus(permission);

    if (
      cameraPermissionStatus === "granted" &&
      microphonePermissionStatus === "granted" &&
      mediaLibraryPermission?.granted
    ) {
      router.replace("/");
    } else {
      Alert.alert("Please go to settings and enable permissions");
    }
  };
  return (
    <>
      <Stack.Screen options={{ headerTitle: "permissions" }} />
      <View style={styles.container}>
        <View style={styles.spacer} />
        <Text style={styles.subtitle}>
          MDCAMERA needs access to few permission in order to work properly.
        </Text>
        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            size={ICON_SIZE}
            color={"orange"}
          />
          <Text style={styles.footNote}>Required</Text>
        </View>
        <View style={styles.spacer} />
        <View
          style={StyleSheet.compose(styles.row, styles.PermissionContainer)}
        >
          <Ionicons name="camera-outline" size={ICON_SIZE} color={"gray"} />
          <View style={styles.permissionText}>
            <Text>Camera</Text>
            <Text>Used for taking photos and videos.</Text>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={cameraPermissionStatus === "granted"}
            onChange={requestCameraPermission}
          />
        </View>
        <View
          style={StyleSheet.compose(styles.row, styles.PermissionContainer)}
        >
          <Ionicons name="camera-outline" size={ICON_SIZE} color={"gray"} />
          <View style={styles.permissionText}>
            <Text>Microphone</Text>
            <Text>Used for taking recording videos.</Text>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={microphonePermissionStatus === "granted"}
            onChange={requestMicrophonePermission}
          />
        </View>
        <View
          style={StyleSheet.compose(styles.row, styles.PermissionContainer)}
        >
          <Ionicons name="camera-outline" size={ICON_SIZE} color={"gray"} />
          <View style={styles.permissionText}>
            <Text>Library</Text>
            <Text>Used for saving, viewing and more.</Text>
          </View>
          <Switch
            trackColor={{ true: "orange" }}
            value={mediaLibraryPermission?.granted}
            onChange={async () => {
              await requestMediaLibraryPermission();
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleContinue}
          style={StyleSheet.compose(styles.row, styles.continueButton)}
        >
          <Ionicons
            name="arrow-forward-outline"
            color={"white"}
            size={ICON_SIZE}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Permissions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    textAlign: "center",
  },
  footNote: { fontSize: 12, fontWeight: "bold", letterSpacing: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  spacer: { marginVertical: 8 },
  PermissionContainer: {
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  permissionText: { marginLeft: 10, flexShrink: 1 },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
    alignSelf: "center",
  },
});
