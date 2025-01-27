import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";

import Flow, { FlowInput } from "./Flow";
import Sidebar from "./Sidebar";




const App: React.FC = () => {
  // Check if the URL has `data` in the query string
  const urlParams = new URLSearchParams(window.location.search);
  const jsonData = urlParams.get("data"); // Extract `data` query parameter

  // If `data` exists, parse it or handle as needed
  const isEmbedded = !!jsonData; // `isEmbedded` mode if JSON data exists in the URL

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ReactFlowProvider>
        {isEmbedded ? (
          // Render an embedded version without the Sidebar
          <Flow isEmbed={true} data={JSON.parse(jsonData) as FlowInput} />
        ) : (
          // Render the default version with Sidebar
          <>
            <Sidebar />
            <Flow isEmbed={false} />
          </>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App;
