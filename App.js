import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import domtoimage from 'dom-to-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View,  Platform } from 'react-native';
import { useState,useRef } from 'react';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer'; 
import * as ImagePicker from 'expo-image-picker';
import LoadingComponent from "./components/LoadingComponent";
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';

import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {

  const [status, requestPermission] = MediaLibrary.usePermissions();


  if (status === null) {
    requestPermission();
  }

  const imageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };


  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmoji(null)
  };

  const onAddSticker = () => {
   setIsModalVisible(true);
  };
  const onModalClose = () => {
   setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {

    if( Platform.OS !=="web"){
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
  
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    }else{
      try {
        const dataUrl = await domtoimage.toPng(imageRef.current, {
          quality: 0.95,
          width: 320,
          height : 450,
        });
  
        let link = document.createElement('a');
        link.download = 'sticker-smash.png';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }


  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />
       <View style={styles.imageContainer}  ref={imageRef} collapsable={false}>
          <ImageViewer styleOption={styles.imageContainer.contentPlace} selectedImage={selectedImage} placeholderImageSource={PlaceholderImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          
        </View>


      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}


      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>

      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    paddingTop: 50,
  },
  imageContainer: {
    // flex: 1,
  
    width: 320,
    height : 450,
    overflow : "hidden",
    borderRadius:18,
    contentPlace:{
      width: "100%",
      height : "100%",
    }
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
