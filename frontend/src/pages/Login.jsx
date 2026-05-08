import "@fortawesome/fontawesome-free/css/all.min.css";

import { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      if (user.VaiTro === "sales") {
        window.location.href = "/sales";
      } else if (user.VaiTro === "accountant") {
        window.location.href = "/accountant";
      } else if (user.VaiTro === "manager") {
        window.location.href = "/manager";
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div
      className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-blue-900
                to-blue-500
            "
    >
      <div
        className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-md
                    overflow-hidden
                "
      >
        <div
          className="
                        bg-blue-700
                        text-white
                        p-10
                        text-center
                    "
        >
          <i
            className="
                            fas fa-home
                            text-6xl
                            mb-4
                        "
          ></i>

          <h1
            className="
                            text-3xl
                            font-bold
                        "
          >
            HomeStay Dorm
          </h1>

          <p className="mt-2 opacity-90">Ký túc xá tư nhân</p>
        </div>

        <div className="p-10">
          <h2
            className="
                            text-2xl
                            font-semibold
                            text-center
                            mb-8
                        "
          >
            Đăng nhập hệ thống
          </h2>

          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
                            w-full
                            px-5
                            py-4
                            border
                            rounded-2xl
                            mb-4
                            focus:outline-none
                            focus:border-blue-500
                        "
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
                            w-full
                            px-5
                            py-4
                            border
                            rounded-2xl
                            mb-6
                            focus:outline-none
                            focus:border-blue-500
                        "
          />

          <button
            onClick={login}
            className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-4
                            rounded-2xl
                            font-semibold
                            text-lg
                            transition
                        "
          >
            ĐĂNG NHẬP
          </button>

          <p
            className="
                            text-red-500
                            text-center
                            mt-4
                        "
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
