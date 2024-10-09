import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";

const ProgressBar = ({ loading }) => {
  const location = useLocation();

  useEffect(() => {
      NProgress.start();
    if (!loading) {
      NProgress.done();
    }
    return () => {
      NProgress.done();
    };
  }, [location.pathname, loading]);

  return <></>;
};

export default ProgressBar;
