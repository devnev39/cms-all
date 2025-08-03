import React from "react";

function NotFound() {
  return (
    <>
      <div className="container text-center pt-5">
        <h1 className="display-4 text-white">404 - Page Not Found</h1>
        <p className="lead text-white">
          The page you are looking for does not exist.
        </p>
        <p className="text-white">
          Please check the URL or return to the home page.
        </p>
        <a href="/" className="btn btn-primary">
          Go to Home
        </a>
      </div>
    </>
  );
}

export default NotFound;
