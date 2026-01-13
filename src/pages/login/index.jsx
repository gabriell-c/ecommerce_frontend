import { useState, useRef, useEffect } from "react";
import Logo from "../../../public/imgs/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRightToBracket,
  faSpinner,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import useAuthCheck from "../../components/verify";
import { BASE_URL } from "../../config";

const LoginPage = () => {
  const isLogged = useAuthCheck(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isLogged) {
      navigate("/"); 
    }
  }, [isLogged, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({}); 

    try {
      const res = await fetch(`${BASE_URL}/api/users/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email, 
          password: password,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
          console.error("Erro detalhado do Django:", data);
          throw new Error(data.detail || "Invalid email or password");
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      window.dispatchEvent(new Event("authChange")); 

      navigate("/");
      
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:pt-[170px] pt-[100px]  min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center ">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#3626a7] rounded-full mx-auto flex items-center justify-center shadow-xl">
            <img src={Logo} alt="logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-bold mt-6 text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Log in with your email</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:border-[#3626a7] focus:outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-100"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:border-[#3626a7] focus:outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3626a7]"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#3626a7]"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3626a7] hover:bg-[#2a1d8a] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <>
                  Log In
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
             <p className="text-base text-gray-600 text-center">
              Don't have an account? <Link to={"/register"} className="text-[var(--color3)] font-semibold hover:underline">Sign up</Link>
            </p>
            <p className="text-sm text-gray-500 text-center hover:text-gray-800 cursor-pointer">Forgot Password?</p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faShieldAlt} />
          Secure SSL Encryption
        </div>
      </div>
    </div>
  );
};

export default LoginPage;