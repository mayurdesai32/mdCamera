import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import {
  useCameraPermission,
  Camera,
  useCameraDevice,
} from "react-native-vision-camera";
import { Redirect, useRouter } from "expo-router";
import CameraButton from "@/components/CameraButton";
import { BlurView } from "expo-blur";
import { FontAwesome5 } from "@expo/vector-icons";
import ZoomControl from "./ZoomControl";
import ExposureControl from "./ExposureControl";

const HomeScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const microphonePermission = Camera.getMicrophonePermissionStatus();
  const redirectToPermissions =
    !hasPermission || microphonePermission === "not-determined";

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "front"
  );
  const device = useCameraDevice(cameraPosition);

  const [showZoomControls, setShowZoomControls] = useState(false);

  const [showExposureControls, setShowExposureControls] = useState(false);

  const [zoom, setZoom] = useState(device?.neutralZoom);
  const [exposure, setExposure] = useState(0);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [torch, setTorch] = useState<"off" | "on">("off");

  const camera = useRef<Camera>(null);
  const router = useRouter();

  const takePicture = async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null");

      console.log("taking a picture...");
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      });

      //   const video = await camera.current.startRecording({
      //     onRecordingFinished: (video) => console.log(video),
      //     onRecordingError: (error) => console.error(error),
      //   });

      router.push({
        pathname: "/media",
        params: { media: photo.path, type: "photo" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (redirectToPermissions) return <Redirect href={"/Permissions"} />;
  if (!device) return <></>;
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 2, borderRadius: 20, overflow: "hidden" }}>
        <Camera
          ref={camera}
          style={{ flex: 1 }}
          device={device}
          isActive
          resizeMode="cover"
          exposure={exposure}
          torch={torch}
          zoom={zoom}
          //   video
          photo
        />
        <BlurView
          intensity={100}
          tint="systemThinMaterialDark"
          style={{
            flex: 1,
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: 10,
          }}
          //   experimentalBlurMethod="dimezisBlurView"
        >
          <Text>
            Exposure:{exposure} | Zoom: x{zoom}
          </Text>
        </BlurView>
      </View>
      {/* controls */}
      {showZoomControls ? (
        <ZoomControl
          setZoom={setZoom}
          setShowZoomControls={setShowZoomControls}
          zoom={zoom ?? 1}
        />
      ) : showExposureControls ? (
        <ExposureControl
          setExposure={setExposure}
          setShowExposureControls={setShowExposureControls}
          exposure={exposure}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* display */}
          <View style={{ flex: 0.7 }}>
            <Text>Max FPS:{device.formats[0].maxFps}</Text>
            <Text>
              Width:{device.formats[0].photoWidth} Height:
              {device.formats[0].photoHeight}
            </Text>
            <Text>Camera:{device.name}</Text>
          </View>
          {/* middle section */}
          <View
            style={{
              flex: 0.7,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <CameraButton
              iconName={torch === "on" ? "flashlight" : "flashlight-outline"}
              onPress={() => setTorch((t) => (t === "off" ? "on" : "off"))}
              containerStyle={{ alignSelf: "center" }}
            />
            <CameraButton
              iconName={flash === "on" ? "flash" : "flash-off-sharp"}
              onPress={() => setFlash((t) => (t === "off" ? "on" : "off"))}
              containerStyle={{ alignSelf: "center" }}
            />
            <CameraButton
              iconName="camera-reverse-outline"
              onPress={() =>
                setCameraPosition((p) => (p === "back" ? "front" : "back"))
              }
              containerStyle={{ alignSelf: "center" }}
            />

            <CameraButton
              iconName="image-outline"
              onPress={() => {
                const link = Platform.select({
                  ios: "photos-redirect://",
                  android: "content://media/external/images/media",
                });
                Linking.openURL(link!);
              }}
              containerStyle={{ alignSelf: "center" }}
            />
          </View>

          {/* bottom section */}

          <View
            style={{
              flex: 1.1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <CameraButton
              iconSize={40}
              title="+/-"
              onPress={() => setShowZoomControls((t) => !t)}
              containerStyle={{ alignSelf: "center" }}
            />
            <TouchableHighlight onPress={takePicture}>
              <FontAwesome5 name="dot-circle" size={55} color={"white"} />
            </TouchableHighlight>

            <CameraButton
              iconSize={40}
              title="1x"
              onPress={() => setShowExposureControls((s) => !s)}
              containerStyle={{ alignSelf: "center" }}
            />
          </View>
        </View>
      )}
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
