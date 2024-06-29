import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

// Définition du composant de chargement
const LoadingComponent = ({ message = 'Chargement...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

// Définition des styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width:"100%",
    height:"100%"
  },
  message: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});

export default LoadingComponent;
