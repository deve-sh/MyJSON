import React from "react";

const Header = props => {
  return (
    <div id="header">
      <div className="fixedContainer row">
        <div className="col-6">MyJSON</div>
        <div className="col-6 alignright">
          <i
            className="fas fa-adjust fa-lg darkmodebutton"
            onClick={props.toggleDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
