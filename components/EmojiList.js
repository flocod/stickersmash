import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Text, Platform, Pressable, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from './LoadingComponent';

export default function EmojiList({ onSelect, onCloseModal }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch(
          'https://emoji-api.com/emojis?access_key=cad0ef22e7dba14201b21c09c3101221328feeae'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        setEmojis(data);


        if (Platform.OS === 'web') {
          localStorage.setItem('Emojis', JSON.stringify(data));
        } else {
          await AsyncStorage.setItem('Emojis', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
      }
    };

    const loadEmojis = async () => {
      try {
        let storedEmojis;
        if (Platform.OS === 'web') {
          storedEmojis = localStorage.getItem('Emojis');
        } else {
          storedEmojis = await AsyncStorage.getItem('Emojis');
        }

        if (storedEmojis) {
          setEmojis(JSON.parse(storedEmojis));
        } else {
          fetchEmojis();
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadEmojis();
  }, []);

  if (emojis.length===0) {
    return <LoadingComponent />;
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === 'web'}
      data={emojis}
      keyExtractor={(item) => item.slug}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            onSelect(item.character);
            onCloseModal();
          }}
        >
          <Text style={styles.text}>{item.character}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 70,
    marginRight: 20,
  },
});
