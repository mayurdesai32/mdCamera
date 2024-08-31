import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import CameraButton from "@/components/CameraButton";
import { saveToLibraryAsync } from "expo-media-library";

const mediaScreen = () => {
  const { media, type } = useLocalSearchParams();
  const router = useRouter();
  console.log(media, type);
  return (
    <View style={styles.container}>
      {
        type === "photo" ? (
          <Image
            source={{ uri: `file://${media}` }}
            style={{ width: "100%", height: "80%", resizeMode: "contain" }}
          />
        ) : null
        // <video
        //   source={{ uri: media }}
        //   style={{ width: "100%", height: "100%"  }}
        // />
      }
      <CameraButton
        title="Save to gallery"
        onPress={async () => {
          saveToLibraryAsync(media as string);
          Alert.alert("Saved to gallery!");
          router.back();
        }}
        containerStyle={{ alignSelf: "center" }}
      />
      <Link href="/" style={styles.link}>
        <Text style={{ color: "white", fontSize: 20 }}>Delete and go back</Text>
      </Link>
    </View>
  );
};

export default mediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "black",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    alignSelf: "center",
  },
});
