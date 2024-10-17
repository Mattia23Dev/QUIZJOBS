import React from "react";
// import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Typography, Button } from "antd";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";

const languages = [
  {
    code: "en",
    lang: "English",
  },
  {
    code: "it",
    lang: "Italian",
  },
];
const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const handleMenuClick = (e) => {
    i18n.changeLanguage(e.key);
  };
  const menu = (
    <Menu
      onClick={handleMenuClick}
      style={{ width: "130px;", left: "1180px;", top: "47px;" }}
    >
      {languages.map((item) => (
        <Menu.Item key={item.code}>{item.lang}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown 
    style={{ width: "130px;", left: "1180px;", top: "47px;" }}
    
    overlay={menu}>
      <div className="language-selector-icon">
        <GrLanguage size={20} className="" />
      </div>
    </Dropdown>
  );
};
export default LanguageSelector;
