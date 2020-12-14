'use strict';

const e = React.createElement;

const timerAPI = 'http://localhost:8000/get-timer.php';
const socketConnection = 'ws://localhost:8080';

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      flightInfo: {}
    }
    this.timerActive = true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.flightInfo) {
      return { };
    }
    return {
      flightInfo: nextProps.flightInfo
    }
  }

  componentDidMount () {
    fetch(timerAPI)
      .then(response => response.json())
      .then(data => this.setState({flightInfo: data}));
  }

  render() {

    var timerRunning = true;

    if (this.timerActive) {
      clearTimeout(this.timer);
      this.timer = setTimeout(
        function() {
          this.timerActive = false;
          this.setState({resetTimer: true});
        }
        .bind(this),
        300000
      );
    }
    else {
      timerRunning = false;
    }

    this.timerActive = true;

    if (Object.keys(this.state.flightInfo).length === 0) {
      timerRunning = false;
    }
    if (this.state.flightInfo.Timestamp != null) {
      var timeVal = new Date(this.state.flightInfo.Timestamp);
      if (((new Date) - timeVal) / (1000 * 60) > 5)
        timerRunning = false;
    }

    if (!timerRunning) {
      return (
        <div className="App">
          <div className="AircraftListContainer"></div>
          <div className="FooterContainer">Aircraft Timer Unavailable</div>
        </div>
      );
    }
    
    var aircrafts = [];
    var time;
    if (this.state.flightInfo.Aircraft && this.state.flightInfo.Aircraft.LoadTimer) {
        if (!Array.isArray(this.state.flightInfo.Aircraft.LoadTimer)) {
          aircrafts.push(this.state.flightInfo.Aircraft.LoadTimer);
        }
        else {
          aircrafts = this.state.flightInfo.Aircraft.LoadTimer;
        }
      }
    
    var weather;
    if (this.state.flightInfo.WeatherState == "Blue Skies") {
      weather = <span className="WeatherContainer">
            <div>Uppers <span style={{color: "#7CFC00"}}>{this.state.flightInfo.UpperReport}</span></div>
            <div>Jump run <span style={{color: "#7CFC00"}}>{this.state.flightInfo.JumpRunReport}</span></div>
            <div><span style={{color: "#7CFC00"}}>{this.state.flightInfo.SeparationReport}</span> seconds between groups</div>
          </span>
    }
    else if (this.state.flightInfo.WeatherState == "Wind Hold") {
      weather = <span className="WeatherContainer"><img style={{maxWidth: "100%", maxHeight: "100%"}} src={'./img/WindHoldRight.png'} alt="WindHold" /></span>
    }
    else if (this.state.flightInfo.WeatherState == "Weather Hold") {
      weather = <span className="WeatherContainer"><img style={{maxWidth: "100%", maxHeight: "100%"}} src={'./img/WeatherHoldRight.png'} alt="WeatherHold" /></span>
    }
    else if (this.state.flightInfo.WeatherState == "Non-Licensed Jumper Wind Hold") {
      weather = <span className="WeatherContainer">
            <div>Uppers <span style={{color: "#7CFC00"}}>{this.state.flightInfo.UpperReport}</span></div>
            <div>Jump run <span style={{color: "#7CFC00"}}>{this.state.flightInfo.JumpRunReport}</span></div>
            <div><span style={{color: "#7CFC00"}}>{this.state.flightInfo.SeparationReport}</span> seconds between groups</div>
            <div><span style={{color: "#E01C0B"}}>Non-Licensed Jumper Wind Hold</span></div>
          </span>
    }
    
    if (this.state.flightInfo.Timestamp != null) {
      var timeVal = new Date(this.state.flightInfo.Timestamp);
      var hr = timeVal.getHours();
      var min = timeVal.getMinutes();
      if (min < 10) {
        min = "0" + min;
      }
      var ampm = "AM";
      if (hr == 12)
        ampm = "PM";
      if (hr == 0)
        hr = 12;
      if (hr > 12 ) {
          hr -= 12;
          ampm = "PM";
      }
      time = <span className="TimeContainer"><span><span style={{fontSize: "10vmin"}}>{hr}:{min}</span><span style={{fontSize: "4vmin", color: "#4070EF"}}> {ampm}</span></span></span>;
    }

    return (
      <div className="App">
          <div className="AircraftListContainer"><AircraftList aircrafts={aircrafts}/></div>
          <div className="FooterContainer">
            {time}
            {weather}
          </div>
      </div>
    );
    
  }
}

document.querySelectorAll('.app')
  .forEach(domContainer => {
    ReactDOM.render(
      e(App, { }),
      domContainer
    );
  });

var conn = new ab.Session(socketConnection,
      function() {
          conn.subscribe('updateTimer', function(topic, data) {
              document.querySelectorAll('.app')
                  .forEach(domContainer => {
                      ReactDOM.render(
                      e(App, { flightInfo: data}),
                      domContainer
                      );
                  });
          });
      },
      function() {
          console.warn('WebSocket connection closed');
      },
      {'skipSubprotocolCheck': true}
  );