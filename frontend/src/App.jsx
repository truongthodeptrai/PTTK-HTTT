import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import SalesPage from "./pages/accountant/AccountantPage";
import AccountantPage from "./pages/manager/ManagerPage";
import ManagerPage from "./pages/sales/SalesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/accountant" element={<AccountantPage />} />
      <Route path="/manager" element={<ManagerPage />} />
    </Routes>
  );
}

export default App;
