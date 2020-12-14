'use strict';

class Aircraft extends React.Component {
  constructor(props) {
    super();
    this.state = {
        aircraft: props.aircraft
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
        aircraft: nextProps.aircraft
    }
  }

  render() {
    const aircraft = this.state.aircraft;
    if (aircraft == null) {
        return (
            <div className={"emptyContainer"}></div>
        );
    }
    else if (aircraft == "header") {
        return (
            <div className={"header"}>
                <span style={{flex: 40}} className={"headerBox"}>
                    <div className={"nameContainer"}>
                        <span>Aircraft</span>
                        <span style={{paddingRight: "1vh"}}>Load</span>
                    </div>
                </span>
                <span style={{flex: 20}} className={"headerBox"}>Loading Area</span>
                <span style={{flex: 12}} className={"headerBox"}></span>
                <span style={{flex: 10}} className={"headerBox"}>Call</span>
            </div>
        )
    }
    else {
        var loadZoneImg = <span className={"box loadzone clear"}></span>;
        if (aircraft.LoadingAt == "North") {
            loadZoneImg = <span className={"box loadzone white"}><img key={aircraft.Name} style={{maxWidth: "100%", maxHeight: "100%"}} src={'./img/LoadNorthWideSmall.png'} alt="North" /></span>;
        }
        else if (aircraft.LoadingAt == "South") {
            loadZoneImg = <span className={"box loadzone white"}><img key={aircraft.Name} style={{maxWidth: "100%", maxHeight: "100%"}} src={'./img/LoadSouthWideSmall.png'} alt="South" /></span>;
        }
        else if (aircraft.LoadingAt == "Military") {
            loadZoneImg = <span className={"box loadzone white"}><img key={aircraft.Name} style={{maxWidth: "100%", maxHeight: "100%"}} src={'./img/Military.png'} alt="Military" /></span>;
        }
        else if (typeof aircraft.LoadingAt === 'string' || aircraft.LoadingAt instanceof String) {
            loadZoneImg = <span className={"box loadzone white"}>
                <svg viewBox="0 0 140 50" className={"load"}>
                    <text textAnchor="middle" x="70" y="35">{aircraft.LoadingAt}</text>
                </svg>
            </span>;
        }
        else {
            loadZoneImg = <span className={"box loadzone clear"}></span>;
        }


        var CallState = <span className={"box callstatecontainer clear"}></span>;
        if (aircraft.CallState == "10 Min")
            CallState = <span className={"box callstatecontainer red"}>
                <svg viewBox="0 0 170 100" className={"callstate"}>
                    <text textAnchor="middle" x="85" y="67">{aircraft.CallState}</text>
                </svg>
            </span>;
        else if (aircraft.CallState == "5 Min")
            CallState = <span className={"box callstatecontainer yellow"}>
                <svg viewBox="0 0 170 100" className={"callstate"}>
                    <text textAnchor="middle" x="85" y="67">{aircraft.CallState}</text>
                </svg>
            </span>;
        else if (aircraft.CallState == "Now")
            CallState = <span className={"box callstatecontainer green"}>
                <svg viewBox="0 0 170 100" className={"callstate"}>
                    <text textAnchor="middle" x="85" y="67">{aircraft.CallState}</text>
                </svg>
            </span>;
        
        
        var Timer = <span className={"timer"}>
                <svg viewBox="0 0 145 100" className={"call"}>
                    <text textAnchor="end" x="128.5" y="84">{aircraft.Call}</text>
                </svg>
            </span>;
        if (aircraft.Call == "00" && Object.keys(aircraft.CallState).length === 0)
            Timer = <span className={"timer zerotimer"}>
                <svg viewBox="0 0 145 100" className={"call"}>
                    <text className={"graytext"} textAnchor="end" x="128.5" y="84">{aircraft.Call}</text>
                </svg>
            </span>;
        
        
            return (
            <div className={"container"}>
                <span style={{flex: 40, fontSize: "6vmin"}} className={"box"}>
                    <div className={"nameContainer"}>
                        <svg viewBox="0 0 100 10" className={"name"}>
                            <text textAnchor="left" x="2" y="9.5">{aircraft.Name}</text>
                            <text textAnchor="end" x="98" y="9.5">{aircraft.LoadNumber}</text>
                        </svg>
                    </div>
                </span>
                {loadZoneImg}
                {CallState}
                {Timer}
            </div>
        );
    }
  }
}