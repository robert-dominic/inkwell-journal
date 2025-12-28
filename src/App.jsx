import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EntriesProvider } from "./contexts/EntriesContext";
import Home from './pages/Home';
import Journal from './pages/Journal';
import Editor from "./pages/Editor";

function App() {
  return (
    <AuthProvider>
      <EntriesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/editor/:id" element={<Editor />} />
          </Routes>
        </Router>
      </EntriesProvider>
    </AuthProvider>
  )
}

export default App;