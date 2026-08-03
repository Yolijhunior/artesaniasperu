import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  color?: string;
}

export const CustomButton = ({ title, onPress, color = '#007bff' }: Props) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { padding: 12, borderRadius: 8, alignItems: 'center', marginVertical: 5 },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});