import React, { useState, useEffect, useMemo } from 'react';

import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import useWeatherApi from './useWeatherApi';
import WeatherCard from './WeatherCard';
import sunriseAndSunsetData from './sunrise-sunset2.json';
import WeatherSetting from './WeatherSetting';

import { findLocation } from '../data/utils';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  console.log(location);

  if (!location) return null;

  const now = new Date();

  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .replace(/\//g, '-');

  console.log(nowDate);

  const locationDate =
    location.time &&
    location.time.find((time) => time.dataTime === nowDate);

  console.log(locationDate);

  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();

  console.log(sunriseTimestamp);

  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimestamp = now.getTime();

  console.log(sunsetTimestamp);
  console.log(nowTimestamp);

  return sunriseTimestamp <= nowTimestamp &&
    nowTimestamp <= sunsetTimestamp
    ? 'day'
    : 'night';
};

const WeatherApp = () => {
  const storageCity = localStorage.getItem('cityName');
  const [currentCity, setCurrentCity] = useState(
    storageCity || '臺北市'
  );

  const currentLocation = findLocation(currentCity) || {};
  const [weatherElement, fetchData] =
    useWeatherApi(currentLocation);
  const { locationName, isLoading } = weatherElement;
  const [currentTheme, setCurrentTheme] = useState('light');

  const [currentPage, setCurrentPage] =
    useState('WeatherCard');

  const moment = useMemo(() => getMoment('臺北'), []);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  useEffect(() => {
    localStorage.setItem('cityName', currentCity);
  }, [currentCity]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render, isloading: ', isLoading)}
        {console.log(moment)}
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
            cityName={currentLocation.cityName}
          />
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            setCurrentPage={setCurrentPage}
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
