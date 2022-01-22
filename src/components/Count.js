import { useState } from 'react';
import '../style/count.scss';

const shadow = {
  boxShadow: '0 0 10px 10px #eaeaea',
  padding: 20, // 省略 px，樣式會自動帶入單位變成 '20px'
  marginRight: 100,
};

const appstyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
};

function Count() {
  const [count, setCount] = useState(5);

  return (
    <div className="App" style={appstyle}>
      <div className="container" style={shadow}>
        {console.log('render', count)}

        {count < 10 && (
          <div
            className="chevron chevron-up"
            onClick={() => {
              setCount(count + 1);
              console.log(`current count is ${count + 1}`);
            }}
          ></div>
        )}

        <div className="number">{count}</div>
        <div
          className="chevron chevron-down"
          style={{ visibility: count <= 0 && 'hidden' }}
          onClick={() => {
            setCount(count - 1);
          }}
        ></div>
      </div>
    </div>
  );
}

export default Count;
