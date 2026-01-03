import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./pages/RestaurantList";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import Signup from "./pages/Signup";
import UserPage from "./pages/UserPage";
import RestaurantOwnerPage from "./pages/RestaurantOwnerPage";
import Navbar from "./components/Navbar";
import { RoutesEnum } from "./utils";
import "./App.scss";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={RoutesEnum.Home} element={<RestaurantList />} />
        <Route path={RoutesEnum.ADD} element={<AddRestaurant />} />
        <Route path={RoutesEnum.EDIT} element={<EditRestaurant />} />
        <Route path={RoutesEnum.RESTAURANT_DETAIL} element={<RestaurantDetail />} />
        <Route path={RoutesEnum.SIGNUP} element={<Signup />} />
        <Route path={RoutesEnum.USER_PAGE} element={<UserPage />} />
        <Route path={RoutesEnum.RESTAURANT_OWNER_PAGE} element={<RestaurantOwnerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
