// File to house the browser window.

import React, { useEffect } from "react";
import hljs from "highlight.js/lib/highlight";
import { loop, get } from "lesser.js";
import "highlight.js/styles/monokai-sublime.css";
import javascript from "highlight.js/lib/languages/javascript";

hljs.registerLanguage("javascript", javascript);
hljs.initHighlightingOnLoad();

const BrowserWindow = props => {
  useEffect(() => {
    loop(get(".javascript"), node => {
      hljs.highlightBlock(node); // Highlight each javascript code node.
    });
  }, []);

  return (
    <div className="browserContainer">
      <div className="browserRow">
        <span className="tabDot" style={{ background: "#ED594A" }} />
        <span className="tabDot" style={{ background: "#FDD800" }} />
        <span className="tabDot" style={{ background: "#5AC05A" }} />
      </div>
      <div className={"browserContent"}>
        <pre>
          <code className="js hljs javascript">{props.data}</code>
        </pre>
      </div>
    </div>
  );
};

BrowserWindow.defaultProps = {
  data: `data = [
  {
    yourId : 1,
    yourData : "Some Random Text",
    yourBool : true,
    yourSubData : "Some More Random Text"
  },
  {
    yourId : 2,
    yourData : "You can specify range of IDs",
    yourBool : false,
    yourSubData : "Define attributes, serial IDs and more ..."
  }
  // ... Get as much data as you want.
]`
};

export default BrowserWindow;
