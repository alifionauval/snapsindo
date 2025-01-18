import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot"; // Impor komponen Chatbot
import Home from "./pages/Home";
import TentangKami from "./pages/TentangKami";
import Projects from "./pages/Projects";
import KontakKami from "./pages/KontakKami";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminReservation from "./pages/AdminReservation";
import EditReservation from "./pages/EditReservation";
import AdminProjects from "./pages/AdminProjects";

const cors = require('cors');
app.use(
  cors({
    origin: 'https://backend-dsnap.vercel.app/', // Ganti sesuai dengan domain frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode HTTP yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
    credentials: true, // Mengizinkan pengiriman cookie
  })
);

function App() {
  return (
    <Router>
      <ConditionalLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/pemesanan" element={<KontakKami />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminprojects" element={<AdminProjects />} />
          <Route path="/reservation" element={<AdminReservation />} />
          <Route path="/reservation/edit/:id" element={<EditReservation />} />
        </Routes>
      </ConditionalLayout>
    </Router>
  );
}

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooterRoutes = ["/login", "/admin", "/adminprojects", "/reservation"];
  const shouldHideNavbarFooter =
    hideNavbarFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reservation/edit");

  return (
    <>
      {!shouldHideNavbarFooter && <Navbar />}
      <main>{children}</main>
      {!shouldHideNavbarFooter && <Footer />}
      {!shouldHideNavbarFooter && <Chatbot />}
    </>
  );
};

export default App;
