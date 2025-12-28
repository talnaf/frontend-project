import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./pages/RestaurantList";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import "./App.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/add" element={<AddRestaurant />} />
        <Route path="/edit/:id" element={<EditRestaurant />} />
      </Routes>
    </Router>
  );
}

export default App;
