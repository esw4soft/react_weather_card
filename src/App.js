import logo from './logo.svg';
import './App.css';
import './style/index.scss';

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

const Container = (
  <div className="container" style={shadow}>
    <div className="chevron chevron-up"></div>
    <div className="number">256</div>
    <div className="chevron chevron-down"></div>
  </div>
);

const Container2 = () => (
  <div className="container" style={shadow}>
    <div className="chevron chevron-up"></div>
    <div className="number">256</div>
    <div className="chevron chevron-down"></div>
  </div>
);

function App() {
  return (
    <div className="App" style={appstyle}>
      {Container}
      <Container2 />
    </div>
  );
}

export default App;
