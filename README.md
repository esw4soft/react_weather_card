# Weather Card

react practice : weather card

based on PJCHENder's article & published book : 從 Hooks 開始，讓你的網頁 React 起來

## Note

如果有跳過的天數代表是比較簡單的部分或是已經比較熟的部分 就不會特別 commit\

##### day5 : 可以使用變數`{Container}`或是 React 組件`<Container2 />`呈現 HTML \

##### day6 : React 畫面的重新渲染必須符合兩個條件 :

1.  `setCount` 被呼叫到
2.  `count` 的值確實有改變

##### day7 : 隱藏元素可以在 style 裡面 或是 className 裡面 又或是整個 dom 結構裡面 加入判斷來呈現與否

##### day8 : 因為 for 迴圈沒有回傳直所以無法應用在{}JSX 裡面 但可使用 map 搭配 array.from()或是 array.keys()來進行迴圈操作 :

```jsx
// [0, 1, 2, ..., 8, 9]
let counters =
  [...Array(10).keys()] ||
  Array.from({ length: 10 }, (_, index) => index);

{
  counters.map((item) => <Counter />);
}
```

##### day9 : change html to JSX

##### day10 : 將 JSX 拆成多個組件

##### day11 : 千萬不能在條件式（conditions）、迴圈（loops）或嵌套函式（nested functions）中呼叫 Hook 方法

因 React 組件（例如，`<Counter />`）每次在渲染或更新畫面時，都會呼叫產生這個組件的函式（`Counter()`），而在 React Hooks 中會去記錄這些 Hooks 在函式中被呼叫的順序，以確保資料能夠被相互對應，但若當我們將 Hooks 放到條件式或迴圈時，就會破壞了這些 Hooks 被呼叫到的順序，如此會造成錯誤。

##### day12 : React 開發者工具 React Developer Tools

1. `Components` React 組件
2. `Profilers` 效能檢視

##### day14 : Weather Card -- CSS in JS

解決不小心命名了同樣的 class 名稱，導致樣式相互影響或彼此覆蓋，又或者發生某些樣式權重不夠的情況而難以調整 的狀況

安裝 `@emotion/core` `@emotion/styled` `@emotion/react`

```jsx
// 使用方法

// STEP 1：載入 emotion 的 styled 套件
import styled from '@emotion/styled';

// STEP 2：定義帶有 styled 的 component
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// STEP 3：把上面定義好的 styled-component 當成組件使用
```

##### day15 : emotion 更多用法

```jsx
// 一. 使用Emotion 調整已存在的Components
// 把 SVG 當成一個 React 組件加以載入
import { ReactComponent as CloudyIcon } from '../img/day-cloudy.svg';

// 使用 Emotion 調整 Components 樣式
// Emotion 不僅可以用來建立組件，還可以將原本就存在的組件添加樣式。
// 原本是在 styled. 後面加上一個 HTML 標籤，現在則是放入一個 React 組件，然後就可以在裡面撰寫 CSS 樣式。
const Cloudy = styled(CloudyIcon)`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
`;

// 二. emotion使用props傳入值: 適用在切換暗/亮色主題
// 透過 props 將資料帶入 Styled Components 內
`<Location theme="dark">台北市</Location>;`;

// 透過 props 取得傳進來的資料
// props 會是 {theme: "dark", children: "台北市"}
// 透過傳進來的資料決定要呈現的樣式
const Location = styled.div`
  font-size: 28px;
  color: ${(props) =>
    props.theme === 'dark' ? '#dadada' : '#212121'};
  margin-bottom: 20px;
`;

// 三. 在 Emotion 中可以把撰寫好的 CSS 樣式當作 JavaScript 函式保存起來，步驟如下：
// 1.從 @emotion/core 中匯入 Emotion 提供的 css 函式
// 2.定義帶有 CSS 樣式的函式
// 3.在 Styled Components 中套用定義好的樣式

// STEP 1：匯入 Emotion 提供的 css 函式
import { css } from '@emotion/core';

// STEP 2：將一批 CSS 樣式定義成 JavaScript 函式
const buttonDefault = () => css`
  display: block;
  width: 120px;
  height: 30px;
  font-size: 14px;
  background-color: transparent;
  color: ${props.theme === 'dark' ? '#dadada' : '#212121'};
`;

// STEP 3 在定義 Styled Components 時載入定義好的 CSS 樣式
// 和 CSS 一樣，同樣的樣式後面寫的會覆蓋前面寫的
const rejectButton = styled.button`
  ${buttonDefault}
  background-color: red;
`;
```

##### day16 : 使用 API 抓取資料

1. 如果物件包很多層, 而想拿到包再裡面的 `key,value` 可以使用陣列的 `reduce` 方法搭配 `includes`

```jsx
// STEP 2：將風速（WDSD）、氣溫（TEMP）和濕度（HUMD）的資料取出
const weatherElements = locationData.weatherElement.reduce(
  (neededElements, item) => {
    if (
      ['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)
    ) {
      neededElements[item.elementName] = item.elementValue;
    }
    return neededElements;
  },
  {}
);
```

2. 每次 setSomething 時都是用新的資料覆蓋舊的
   當我們使用物件時，如果有需要物件中的某個值時，不能只是在 setCurrentWeather 帶入想要變更的物件屬性，因為 setSomething 這種用法會完全傳入的值去覆蓋掉舊有的內容。

   ```jsx
   // ❌ 錯誤：不能只寫出要修改或添加的物件屬性
   setCurrentWeather({
     temperature: 31,
   });

   console.log(currentWeather); //{ temperature: 31}
   ```

   正確的做法應該要把舊的資料透過物件的解構賦值帶入新物件中，再去添加或修改想要變更的屬性，像是這樣：

   ```jsx
   // ✅ 正確：先透過解構賦值把舊資料帶入新物件中，再去添加或修改想要變更的資料
   setCurrentWeather({
     ...currentWeather,
     temperature: 31,
   });

   console.log(currentWeather);
   // {
   // observationTime: '2019-10-02 22:10:00',
   // locationName: '臺北市',
   // description: '多雲時晴',
   // temperature: 31,
   // windSpeed: 0.3,
   // humid: 0.88,
   // }
   ```

   ##### day17 : useEffect 基本介紹

   ##### day18 : useEffect + API + useState

   如果使用多個 useEffect 對單一 useState 進行修改會有資料覆蓋問題 可以在 setState 中帶入函式 取得前一個資料來避免覆蓋

   ```jsx
    const [weatherElement, setWeatherElement] = useState(/* ... */)

    // 在 setWeatherElement 中可以帶入函式
    // 可以透過這個函式的參數取得前一次的資料狀態
    setWeatherElement((prevState => {
      // 記得要回傳新的資料狀態回去
      return {
        ...prevState            // 保留原有的資料狀態
        rainPossibility: 0.1    // 添加或更新的資料
      }
    }))
   ```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

```

```
