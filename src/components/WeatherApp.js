import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import { ReactComponent as RainIcon } from '../img/rain.svg';
import { ReactComponent as AirFlowIcon } from '../img/airFlow.svg';
import { ReactComponent as RefreshIcon } from '../img/refresh.svg';
import { ReactComponent as LoadingIcon } from '../img/loading.svg';
import WeatherIcon from './WeatherIcon';
import sunriseAndSunsetData from './sunrise-sunset2.json';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) =>
      isLoading ? '1.5s' : '0s'};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
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

  const {
    observationTime,
    locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;

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
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>
            {description}
            {comfortability}
          </Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)}
              <Celsius>°C</Celsius>
            </Temperature>
            <WeatherIcon
              currentWeatherCode={weatherCode}
              moment={moment || 'day'}
            />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon />
            {Math.round(rainPossibility)} %
          </Rain>
          <Refresh
            onClick={fetchData}
            isLoading={isLoading}
          >
            最後觀測時間 :
            {new Intl.DateTimeFormat('zh-TW', {
              hour: 'numeric',
              ninute: 'numeric',
            }).format(new Date(observationTime))}{' '}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
