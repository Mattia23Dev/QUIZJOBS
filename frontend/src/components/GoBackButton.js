import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const GoBackButton = ({ onClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <IoArrowBackOutline
      size={20}
      className="cursor-pointer"
      onClick={onClick ? onClick : handleClick}
    />
  );
};

export default GoBackButton;
