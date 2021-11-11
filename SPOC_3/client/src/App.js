import './App.css';

function App() {
  return (
    <div>
      <header id="header_div">
        <img src="https://logodix.com/logo/1229689.png" alt="messenger butterfly icon" />
        <div>
          <p>sendertext</p>
        </div>
      </header>

      <div id="chat_container"></div>

      <footer id="footer_div">
        <input type="text" id="input_message" placeholder="message..." />
        <input type="submit" id="input_submit" value="&#10148;" />
      </footer>
    </div>
  );
}

export default App;
