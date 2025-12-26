import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Product</NavLink>
        <NavLink to="/">Contact</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4" />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            {/* Display user image or fallback to default icon */}
            <img 
              src={user.image || assets.profile_icon} 
              alt="profile" 
              className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-200" 
            />
            <ul className="hidden group-hover:block absolute right-0 top-10 bg-white shadow-md border border-gray-200 rounded-md w-40 py-2 text-sm z-40">
              <li
                onClick={() => navigate("/profile")}
                className="p-2 pl-4 hover:bg-primary/10 cursor-pointer"
              >
                My Profile
              </li>
              <li
                onClick={() => navigate("/my-orders")}
                className="p-2 pl-4 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-2 pl-4 hover:bg-primary/10 cursor-pointer text-red-500"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Icons */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-end gap-2 px-5 text-sm md:hidden z-50">
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className="block">
            All Product
          </NavLink>
          
          {user && (
            <>
              {/* Dynamic User Image for Mobile */}
              <div 
                className="flex items-center gap-2 py-2 cursor-pointer" 
                onClick={() => { navigate('/profile'); setOpen(false); }}
              >
                <span className="font-medium">My Profile</span>
                <img 
                  src={user.image || assets.profile_icon} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                  alt="mobile profile"
                />
              </div>
              <NavLink to="/my-orders" onClick={() => setOpen(false)} className="block">
                My Orders
              </NavLink>
            </>
          )}

          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="px-6 py-2 mt-2 bg-primary text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="px-6 py-2 mt-2 bg-primary text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;