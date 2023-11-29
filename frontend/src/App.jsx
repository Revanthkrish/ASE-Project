import Login from "./Login";
import Register from "./Register";
import KanbanBoard from "./components/KanbanBoard";
import { Route, Routes, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:id" element={<KanbanBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
