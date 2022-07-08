import Header from "sections/landing/Header";
import Price from "sections/landing/Price";
import Exchange from "sections/landing/Exchange";
import Community from "sections/landing/Community";
import Partners from "sections/landing/Partners";

//below home page style imported
import style from "./home.module.css";

const Home = () => (
  <div className={style.content}>
    <Header />
    <Price />
    <Exchange />
    <Community />
    <Partners />
  </div>
);

export default Home;
