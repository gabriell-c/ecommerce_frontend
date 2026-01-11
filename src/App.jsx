import { Routes, Route } from "react-router-dom";
import Loading from './components/loading'
import Home from "./pages/home";
import About from "./pages/about";
import Error from "./pages/error";
import Header from "./components/header";
import Login from "./pages/login";
import Register from "./pages/register";
import Product from "./pages/product";
import Profile from './pages/profile'
import Products from './pages/products'
import Category from './pages/category'
import Cart from './pages/cart'
import Footer from './components/footer'
import Smoot from './components/smooth'
import Contact from './pages/contact'

function App() {
  return (
    <Smoot>
      <Loading />
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:tab?" element={<Profile />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/products" element={<Products/>} />
        <Route path="/category/:category" element={<Category/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer/>
    </Smoot>
  );
}

export default App;
