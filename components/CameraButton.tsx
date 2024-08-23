import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface CameraButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}

const CameraButton = ({
  onPress,
  title,
  iconName,
  containerStyle,
  iconSize,
}: CameraButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: Colors.dark.background,
          borderRadius: title ? 6 : 40,
          alignSelf: "flex-start",
        },
        containerStyle,
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize ?? 28} color={"white"} />
      )}
      {title ? (
        <Text style={{ color: "white", fontSize: 20 }}>{title}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

export default CameraButton;

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});
