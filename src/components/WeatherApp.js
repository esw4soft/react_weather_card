import React, { useState, useEffect } from 'react';

import styled from '@emotion/styled';

import { ReactComponent as CloudyIcon } from '../img/day-cloudy.svg';
import { ReactComponent as RainIcon } from '../img/rain.svg';
import { ReactComponent as AirFlowIcon } from '../img/airFlow.svg';
import { ReactComponent as RedoIcon } from '../img/refresh.svg';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
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
  color: #828282;
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
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Cloudy = styled(CloudyIcon)`
  flex-basis: 30%;
`;

const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const WeatherApp = () => {
  console.log('--invok--e fc--');

  useEffect(() => {
    console.log('excute fc in effect');
    fetchCurrentWeather();
    fetchWeatherForecast();
  }, []);
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
  });

  const fetchWeatherForecast = () => {
    fetch(
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-A6779088-0E1F-47AD-930E-5E5D5FAF10E2&locationName=臺北市'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const locationData = data.records.location[0];
        const weatherElements =
          locationData.weatherElement.reduce(
            (neededElements, item) => {
              if (
                ['Wx', 'PoP', 'CI'].includes(
                  item.elementName
                )
              ) {
                neededElements[item.elementName] =
                  item.time[0].parameter;
              }
              return neededElements;
            },
            {}
          );

        setWeatherElement((prevState) => ({
          ...prevState,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility:
            weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }));
      });
  };

  const fetchCurrentWeather = () => {
    fetch(
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

        const currentWeatherData = {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD,
        };

        // 避免覆蓋 使用展開運算子
        setWeatherElement((prevState) => ({
          ...prevState,
          ...currentWeatherData,
        }));
      });
  };
  return (
    <Container>
      {console.log('render')}
      <WeatherCard>
        <Location>{weatherElement.locationName}</Location>
        <Description>
          {weatherElement.description}
          {weatherElement.comfortability}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(weatherElement.temperature)}
            <Celsius>°C</Celsius>
          </Temperature>
          <Cloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {weatherElement.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {Math.round(weatherElement.rainPossibility)} %
        </Rain>
        <Redo
          onClick={() => {
            fetchCurrentWeather();
            fetchWeatherForecast();
          }}
        >
          最後觀測時間 :
          {new Intl.DateTimeFormat('zh-TW', {
            hour: 'numeric',
            ninute: 'numeric',
          }).format(
            new Date(weatherElement.observationTime)
          )}{' '}
          <RedoIcon />
        </Redo>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
