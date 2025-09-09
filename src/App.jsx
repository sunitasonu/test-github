import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import FinancialDashboard from "./pages/FinancialDashboard";

import MasterCustomer from "./pages/MasterCustomer";
import MasterCustomerView from "./pages/MasterCustomerView";
import MasterVegetable from "./pages/MasterVegetable";
import MasterFarmer from "./pages/MasterFarmer";
import TaxRates from "./pages/MasterTaxes";
import UserManagement from "./pages/ManagementUsers";
import SystemSettings from "./pages/SystemSettings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AavakList from "./pages/AavakList";
import AavakCreate from "./pages/AavakCreate";

import ViewAavak from "./pages/AavakView";
import EditAavak from "./pages/AavakEdit";
import PrintAavak from "./pages/AavakPrint";
import AavakPayment from "./pages/AavakPayment";
import AavakPaymentHistory from "./pages/AavakPaymentHistory";
import SaleCreate from "./pages/SaleCreate";
import SalePayment from "./pages/SalePayment";
import SaleList from "./pages/SaleList";
import SalePaymentHistory from "./pages/SalePaymentHistory";

function App() {
  return (
    <>
      <Router>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/" element={<Login />} />

              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Main Application Routes */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Index/login />} />
                      <Route
                        path="/dashboard"
                        element={<FinancialDashboard />}
                      />

                      {/* Aavak Routes */}
                      <Route path="/aavak" element={<AavakList />} />
                      <Route path="/aavak/payment" element={<AavakPayment />} />
                      <Route
                        path="/aavak/payment-history/:id"
                        element={<AavakPaymentHistory />}
                      />
                      <Route path="/aavak/create" element={<AavakCreate />} />

                      {/*Sale Routes */}
                      <Route path="/sale/create" element={<SaleCreate />} />
                      <Route path="/sale" element={<SaleList />} />
                      <Route path="/sale/payment" element={<SalePayment />} />
                      <Route
                        path="/sale/payment-history/:id"
                        element={<SalePaymentHistory />}
                      />

                      <Route path="/aavak/:id" element={<ViewAavak />} />
                      <Route path="/aavak/:id/edit" element={<EditAavak />} />
                      <Route path="/aavak/:id/print" element={<PrintAavak />} />

                      {/* Master Routes */}
                      <Route path="/vegetables" element={<MasterVegetable />} />
                      <Route path="/farmers" element={<MasterFarmer />} />

                      <Route path="/customers" element={<MasterCustomer />} />
                      <Route
                        path="/customers/:id"
                        element={<MasterCustomerView />}
                      />

                      <Route path="/users" element={<UserManagement />} />

                      <Route path="/tax-master" element={<TaxRates />} />

                      {/* Admin Routes */}

                      <Route
                        path="/system-settings"
                        element={<SystemSettings />}
                      />
                      <Route path="/profile" element={<Profile />} />

                      {/* Catch all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </div>
        </SidebarProvider>
      </Router>
    </>
  );
}

export default App;
