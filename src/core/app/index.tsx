import { RouterProvider } from "@tanstack/react-router";
import React, { StrictMode } from "react";

import { router } from "@/core/app/routing";

const InnerApp = () => {
  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <StrictMode>
      <InnerApp />
    </StrictMode>
  );
};

export default App;
