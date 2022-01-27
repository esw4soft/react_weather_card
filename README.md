# Weather Card

react practice : weather card

based on PJCHENder's article & published book : 從 Hooks 開始，讓你的網頁 React 起來

## Note

如果有跳過的天數代表是比較簡單的部分或是已經比較熟的部分 就不會特別 commit\
day5 : 可以使用變數`{Container}`或是 React 組件`<Container2 />`呈現 HTML \
day6 : React 畫面的重新渲染必須符合兩個條件 :

1.  `setCount` 被呼叫到
2.  `count` 的值確實有改變

day7 : 隱藏元素可以在 style 裡面 或是 className 裡面 又或是整個 dom 結構裡面 加入判斷來呈現與否
day8 : 因為 for 迴圈沒有回傳直所以無法應用在{}JSX 裡面 但可使用 map 搭配 array.from()或是 array.keys()來進行迴圈操作 :

```jsx
// [0, 1, 2, ..., 8, 9]
let counters =
  [...Array(10).keys()] ||
  Array.from({ length: 10 }, (_, index) => index);

{
  counters.map((item) => <Counter />);
}
```

day9 : change html to JSX

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
