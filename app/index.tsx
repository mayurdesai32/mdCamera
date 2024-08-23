import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "@/components/Themed";
import {
  useCameraPermission,
  Camera,
  useCameraDevice,
} from "react-native-vision-camera";
import { Redirect, useRouter } from "expo-router";

const HomeScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions =
    !hasPermission || microphonePermission === "not-determined";

  const device = useCameraDevice("front");
  const router = useRouter();

  if (redirectToPermissions) return <Redirect href={"/Permissions"} />;
  if (!device) return <></>;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2, borderRadius: 20, overflow: "hidden" }}>
        <Camera style={{ flex: 1 }} device={device} isActive />
      </View>

      <View style={{ flex: 1 }}></View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
});
