import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Dashboard from "./Pages/Home";
import DisasterDetailPage from "./Pages/DisasterDetails";
import AdminDisasterList from "./Pages/AdminDisasterList";
import AdminSendAlert from "./Pages/AdminSendAlert";
import { Toaster } from "react-hot-toast";

function About() {
  return <h2>About Page</h2>;
}

function Contact() {
  return <h2>Contact Page</h2>;
}

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/disaster/:id" element={<DisasterDetailPage />} />
          <Route path="/admin-panel" element={<AdminDisasterList />} />
          <Route path="/admin/send-alert" element={<AdminSendAlert />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
