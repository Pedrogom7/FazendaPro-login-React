import { useState, useEffect } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import cowIcon from "../assets/silhueta-de-vaca.png";
import plusIcon from "../assets/mais.png";
import threePoints from "../assets/3_pontos.png";
import ninePoints from "../assets/9_pontos.png";
import eyeIcon from "../assets/eye.png";
import eyeSlashIcon from "../assets/eye-slash.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const CORRECT_USERNAME = "admin";
  const CORRECT_PASSWORD = "admin";
  const MAX_ATTEMPTS = 10;
  const BLOCK_TIME = 5 * 60 * 1000;

  useEffect(() => {
    const savedAttempts = localStorage.getItem("attempts");
    const savedBlockedUntil = localStorage.getItem("blockedUntil");

    if (savedAttempts) {
      setAttempts(Number(savedAttempts));
    }

    if (savedBlockedUntil) {
      const now = Date.now();
      if (now < Number(savedBlockedUntil)) {
        setIsBlocked(true);
        setTimeLeft(Number(savedBlockedUntil) - now);
      } else {
        localStorage.removeItem("blockedUntil");
        setIsBlocked(false);
        setAttempts(0);
      }
    }
  }, []);

  useEffect(() => {
    if (isBlocked && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(timer);
            setIsBlocked(false);
            setAttempts(0);
            localStorage.removeItem("attempts");
            localStorage.removeItem("blockedUntil");
            setError("");
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBlocked, timeLeft]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (isBlocked) return;

    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      alert("Login realizado com sucesso!");
      setError("");
      setAttempts(0);
      localStorage.removeItem("attempts");
      setUsername("");
      setPassword("");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("attempts", newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        const blockedUntil = Date.now() + BLOCK_TIME;
        localStorage.setItem("blockedUntil", blockedUntil);
        setTimeLeft(BLOCK_TIME);
        setError("");
      } else {
        setError("Usuário ou senha incorretos!");
      }
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="login-container">
      {/* Ícones */}
      <img src={plusIcon} alt="Ícone de mais" className="plusIcon" />
      <img src={threePoints} alt="Ícone três pontos" className="threePointsIcon" />
      <img src={ninePoints} alt="Ícone nove pontos" className="ninePointsIcon" />
      <img src={plusIcon} alt="Ícone de mais" className="plusIcon2" />

      {/* Logo */}
      <div className="login-left">
        <img src={logo} alt="Logo FazendaPro" className="logo" />
      </div>

      {/* Card de login */}
      <div className="login-card">
        {!isBlocked && error && <div className="error-banner">{error}</div>}
        {isBlocked && (
          <div className="error-banner blocked">
            EXCESSO DE TENTATIVAS <br />
            <small>Aguarde {formatTime(timeLeft)}</small>
          </div>
        )}

        <h2 className="login-title">Bem-vindo !</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`login-input ${error && !isBlocked ? "input-error" : ""}`}
            disabled={isBlocked}
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`login-input ${error && !isBlocked ? "input-error" : ""}`}
              disabled={isBlocked}
            />
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Mostrar senha"
              className="eye-icon"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            />
          </div>


          <div className="remember-me">
            <input type="checkbox" disabled={isBlocked} />
            <span>Lembre de mim</span>
          </div>
          <button
            type="submit"
            disabled={isBlocked}
            className={`login-button ${isBlocked ? "disabled" : ""}`}
          >
            Entrar
          </button>
        </form>

        <p className="recover">
          Esqueceu sua senha? <span>Recuperar</span>
        </p>
      </div>

      {/* Rodapé */}
      <div className="footer">
        <img src={cowIcon} alt="Ícone de vaca" className="footer-icon" />
        <span>Conectando a tecnologia ao campo</span>
      </div>
    </div>
  );
}
