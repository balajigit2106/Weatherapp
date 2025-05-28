import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function Home() {
  const isFocus = useIsFocused();
  const [newsData, setNewsData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFocus) {
      requestLocationPermission();
    }
  }, [isFocus]);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        getCurrentLocation();
      } else {
        setLoading(false);
        console.log('Permission denied');
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  //api's
  const getNews = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem('categories');
      const categories = savedCategories ? JSON.parse(savedCategories) : [];

      const query = categories.length > 0 ? categories.join(' OR ') : 'news';

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query,
        )}&apiKey=46926c1485a844beaacd60fba377db77`,
      );

      return response;
    } catch (error) {
      console.error('Error fetching news', error);
      throw error;
    }
  };

  const getWeather = async (lat, lon) => {
    const tempUnit = await AsyncStorage.getItem('unit');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${
          tempUnit === 'C' ? 'metric' : 'imperial'
        }&appid=${'f9562b68f9cc94186bacadd016f1789a'}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getForecast = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${'f9562b68f9cc94186bacadd016f1789a'}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //data handling
  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;
          console.log('lat and long', latitude, longitude);

          let weatherRes;
          //weather
          try {
            weatherRes = await getWeather(latitude, longitude);
            console.log('weather data', weatherRes);
            setWeatherData(weatherRes?.data || null);
          } catch (error) {
            setWeatherData(null);
            console.log('weather error', error);
          }

          //forecast
          try {
            const forecastRes = await getForecast(latitude, longitude);
            console.log('forecase data', forecastRes);
            const dailyData = forecastRes.data.list.filter(item =>
              item.dt_txt.includes('12:00:00'),
            );
            setForecastData(dailyData);
          } catch (error) {
            setForecastData([]);
            console.log('forecast error', error);
          }

          //news
          try {
            const newsRes = await getNews();
            console.log('newss', newsRes);
            const filteredNews = filterNewsByWeather(
              weatherRes?.data.main.temp,
              newsRes.data.articles,
            );
            setNewsData(filteredNews);
          } catch (error) {
            setNewsData([]);
            console.log('news error', error);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
      error => {
        console.error('Geolocation error:', error);
        setLoading(false);
        setWeatherData(null);
        setNewsData([]);
        setForecastData([]);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const filterNewsByWeather = (weatherTemp, articles) => {
    if (weatherTemp < 10) {
      //cold
      return articles.filter(article =>
        /depress|sad|crisis|loss/i.test(article.title),
      );
    } else if (weatherTemp > 30) {
      //hot
      return articles.filter(article =>
        /fear|danger|terror|risk/i.test(article.title),
      );
    } else {
      //cool
      return articles.filter(article =>
        /win|happy|success|joy/i.test(article.title),
      );
    }
  };

  return (
    <>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6347EB" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Text style={styles.weatherHeading}>Weather Info</Text>
          <View style={styles.weatherBox}>
            <Text style={styles.infoText}>
              Location: {weatherData ? weatherData.name : '-'}
            </Text>
            <Text style={styles.infoText}>
              Temperature: {weatherData ? weatherData.main.temp + '°C' : '-'}
            </Text>
            <Text style={styles.infoText}>
              Condition:{' '}
              {weatherData ? weatherData.weather[0].description : '-'}
            </Text>
          </View>

          <Text style={styles.forecastHeading}>5-Day Forecast</Text>
          {forecastData.length >= 1 ? (
            <>
              {forecastData.map((item, index) => (
                <View key={index} style={styles.forecastCard}>
                  <Text style={styles.forecastDatas}>
                    {new Date(item.dt_txt).toDateString()}
                  </Text>
                  <Text style={styles.forecastDatas}>
                    Temp: {item.main.temp}°C
                  </Text>
                  <Text style={styles.forecastDatas}>
                    Condition: {item.weather[0].description}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={styles.forecast_nodatatext}>No data found</Text>
          )}

          <Text style={styles.newsheadline}>News Headlines</Text>
          <View style={{marginBottom: 60}}>
            {newsData.length >= 1 ? (
              <>
                {newsData.map((article, index) => (
                  <React.Fragment key={index}>
                    {article.urlToImage && (
                      <View style={styles.newsBox}>
                        <Image
                          source={{uri: article.urlToImage}}
                          style={styles.image}
                          resizeMode="contain"
                        />
                        <View style={styles.newsBoxContentContainer}>
                          <Text style={styles.newsTitle}>{article.title}</Text>
                          <Text style={styles.newsDesc}>
                            {article.description}
                          </Text>
                          <Text
                            style={styles.link}
                            onPress={() => Linking.openURL(article.url)}>
                            Read More
                          </Text>
                        </View>
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <Text style={styles.nodatatext}>No articles found</Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
}
