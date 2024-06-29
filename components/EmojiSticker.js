import { View, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {
  const scaleImage = useSharedValue(imageSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const imageStyle = useAnimatedStyle(() => {
    return {
      fontSize: withSpring(scaleImage.value),
    };
  });


  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });


  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value < 150) {
        scaleImage.value = scaleImage.value * 2;
      }else{
        scaleImage.value = scaleImage.value / 2;
      }
    });

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -320, }]}>
        <GestureDetector gesture={doubleTap}>
          <Animated.Text
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { fonSize: imageSize }]}
          > {stickerSource}</Animated.Text>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}
