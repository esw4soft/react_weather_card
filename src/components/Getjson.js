// 導入file system
const fs = require('fs');

// 載入從中央氣象局下載的日出日落檔 A-B0062-001

// 開啟文件
const fileContents = fs.readFileSync(
  '/Users/eason/Documents/code/weathercard/react_weather_card/src/components/A-B0062-001.json',
  'utf-8'
);
// 轉譯
const dataset = JSON.parse(fileContents);

// 找到要的資料位置
const locations =
  dataset.cwbopendata.dataset.locations.location;
const nowTimeStamp = new Date('2022-2-18').getTime(); // 今天的 timestamp

// 過濾需要的資料出來
const newData = locations.map((location) => {
  const time = location.time
    //大於現在的時間
    .filter(
      (time) =>
        new Date(time.dataTime).getTime() > nowTimeStamp
    )
    .map((time) => {
      const { sunrise, sunset } = time.parameter
        //把日出時刻和日落時刻的值過濾出來 {日出時刻：05:24}放入timeParameter
        .filter((timeParameter) =>
          ['日出時刻', '日沒時刻'].includes(
            timeParameter.parameterName
          )
        )
        //把日出時刻轉成sunrise 並放入accumulator物件內 {sunrise: null}
        .reduce((accumulator, timeParameter) => {
          const objectKey =
            timeParameter.parameterName === '日出時刻'
              ? 'sunrise'
              : 'sunset';
          // 塞入sunrise值 {sunrise: 0524} 在accumulator內
          accumulator[objectKey] =
            timeParameter.parameterValue;
          return accumulator;
        }, {});

      return {
        dataTime: time.dataTime,
        sunrise,
        sunset,
      };
    });

  return {
    locationName: location.locationName,
    time,
  };
});

fs.writeFile(
  'sunrise-sunset2.json',
  JSON.stringify(newData, null, 2),
  (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  }
);
