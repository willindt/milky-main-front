/* eslint-disable jsx-a11y/anchor-is-valid */
import style from "./navbar.module.css";

//logo
import logo from "assets/images/logo.png";

const Navbar = () => (
  <div className={style.nav}>
    <div>
      <img src={logo} alt="logo" />
    </div>
    <div className={style.nav__menu}>
      <ul>
        <li>
          <a href="https://docs.milkyway.exchange/">Docs</a>
        </li>
        <li>
          <a href="/farm">Farms</a>
        </li>
        <li>
          <a href="/swap">Launch App</a>
        </li>
      </ul>
    </div>
  </div>
);

export default Navbar;
