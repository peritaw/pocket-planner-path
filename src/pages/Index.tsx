import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { MainLayout } from "@/components/MainLayout";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainLayout onLogout={handleLogout} />;
};

export default Index;
