import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React from "react";

import Flow from "./Flow";
import Sidebar from "./Sidebar";

const App: React.FC = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <ReactFlowProvider>
      <Sidebar />
      <Flow />
    </ReactFlowProvider>
  </div>
);

export default App;
