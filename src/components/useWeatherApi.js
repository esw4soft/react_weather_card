import { useState, useEffect, useCallback } from 'react';

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-A6779088-0E1F-47AD-930E-5E5D5FAF10E2&locationName=${cityName}`
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

const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-A6779088-0E1F-47AD-930E-5E5D5FAF10E2&locationName=${locationName}`
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

const useWeatherApi = (currentLocation) => {
  const { locationName, cityName } = currentLocation;
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

  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] =
        await Promise.all([
          fetchCurrentWeather(locationName),
          fetchWeatherForecast(cityName),
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
  }, [locationName, cityName]);

  useEffect(() => {
    console.log('execute function in useeffect');

    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherApi;
