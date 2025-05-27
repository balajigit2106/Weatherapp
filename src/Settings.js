import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {View, Text, Switch, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const isFocus = useIsFocused();
  const [isCelsius, setIsCelsius] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology',
  ];

  useEffect(() => {
    if (isFocus) {
      settingsData();
    }
  }, [isFocus]);

  const settingsData = async () => {
    const tempUnit = await AsyncStorage.getItem('unit');
    const savedCategories = await AsyncStorage.getItem('categories');
    console.log('categories', savedCategories);
    console.log('tempunittt', tempUnit);
    setIsCelsius(tempUnit === 'C' ? true : false);
    if (savedCategories) setSelectedCategories(JSON.parse(savedCategories));
  };

  const handleTempUnit = async () => {
    const newValue = !isCelsius;
    setIsCelsius(newValue);
    await AsyncStorage.setItem('unit', newValue ? 'C' : 'F');
  };

  const handleCategory = async category => {
    let data;
    if (selectedCategories.includes(category)) {
      data = selectedCategories.filter(item => item !== category);
    } else {
      data = [...selectedCategories, category];
    }
    setSelectedCategories(data);
    console.log('updatedd', data);

    await AsyncStorage.setItem('categories', JSON.stringify(data));
  };

  return (
    <ScrollView contentContainerStyle={styles.settingsContainer}>
      <View style={styles.settingItem}>
        <Text style={styles.switchlabel}>
          Temperature Unit: {isCelsius ? 'Celsius' : 'Fahrenheit'}
        </Text>
        <Switch value={isCelsius} onValueChange={handleTempUnit} />
      </View>

      <Text style={styles.categoryHeading}>News Categories</Text>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          onPress={() => handleCategory(category)}
          style={[
            styles.categoryItem,
            selectedCategories.includes(category) && styles.categorySelected,
          ]}>
          <Text
            style={{
              color: selectedCategories.includes(category) ? '#fff' : '#000',
            }}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
