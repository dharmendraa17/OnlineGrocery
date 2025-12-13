import jwt from "jsonwebtoken";

//Login Seller :/api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie('sellerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
      });
      return res.json({
        success: true,

        message: "Seller Logged in successfully",
      });
    } else {
      console.error("Login error:", error.message || error);
      res.json({ success: false, message: "Invalid Seller Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message || "Seller Login failed",
    });
  }
};

//  Seller Auth: /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
return res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {  
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    console.error("Logout error:", error.message || error);
    res
      
      .json({ success: false, message: error.message || "Logout failed" });
  }
};


