import React from "react";
import { Outlet } from "react-router";

function BackgroundLayout() {
  return (
    <>
      <div
        style={{
          backgroundImage: "url('src/assets/coreimg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-y",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          width: "100vw",
          overflow: "scroll",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default BackgroundLayout;
