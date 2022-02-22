import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import WeatherCard from './WeatherCard';
import sunriseAndSunsetData from './sunrise-sunset2.json';

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

const fetchWeatherForecast = () => {
  return fetch(
    'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-A6779088-0E1F-47AD-930E-5E5D5FAF10E2&locationName=臺北市'
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const locationData = data.records.location[0];
      const weatherElements =
        locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (
              ['Wx', 'PoP', 'CI'].includes(item.elementName)
            ) {
              neededElements[item.elementName] =
                item.time[0].parameter;
            }
            return neededElements;
          },
          {}
        );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

const fetchCurrentWeather = () => {
  return fetch(
    'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-A6779088-0E1F-47AD-930E-5E5D5FAF10E2&locationName=臺北'
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log('data', data);

      const locationData = data.records.location[0];

      const weatherElements =
        locationData.weatherElement.reduce(
          (needElements, item) => {
            if (
              ['WDSD', 'TEMP', 'HUMD'].includes(
                item.elementName
              )
            ) {
              needElements[item.elementName] =
                item.elementValue;
            }

            return needElements;
          },
          {}
        );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};

const WeatherApp = () => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    temperature: 0,
    windSpeed: 0,
    humid: 0,
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: '',
    isLoading: true,
  });

  const { locationName, isLoading } = weatherElement;

  const [currentTheme, setCurrentTheme] = useState('light');

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] =
        await Promise.all([
          fetchCurrentWeather(),
          fetchWeatherForecast(),
        ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetchingData();
  }, []);

  const moment = useMemo(
    () => getMoment(locationName),
    [locationName]
  );

  useEffect(() => {
    console.log('execute function in useeffect');

    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log('render, isloading: ', isLoading)}
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
