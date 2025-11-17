import React from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text } from "react-native";

type ButtonProps = {
  title?: string;
  onPress: () => void;
  image?: ImageSourcePropType;
  width?: number;
  height?: number;
};

export function Button({ title, onPress, image, width = 120, height = 120 }: ButtonProps) {
  return (
    <Pressable style={[styles.button, { width, height }]} onPress={onPress}>
      {image && (
        <Image source={image} style={styles.image} resizeMode="contain" />
      )}
      {title && <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    zIndex: 1,
  },
});
