import { StyleSheet, Image } from 'react-native';

export default function ImageViewer({ placeholderImageSource, selectedImage, styleOption }) {
    const imageSource = selectedImage ? {uri : selectedImage} : placeholderImageSource;
  return (
    <Image source={imageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    position: "relative",
    width: 320,
    height: 450,
    objectFit: "cover",
  },
});
