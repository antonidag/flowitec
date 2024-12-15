import "@xyflow/react/dist/style.css";
import React from "react";

import Flow from "./Flow";
import { FlowProvider } from "./FlowContext";
import Sidebar from "./Sidebar";

const App: React.FC = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <FlowProvider>
      <Sidebar />
      <Flow />
    </FlowProvider>
  </div>
);

export default App;
