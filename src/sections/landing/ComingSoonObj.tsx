import bigLogo from "assets/images/logo_big.png";
import style from "views/home/home.module.css";

import planet1 from "assets/images/planet1.png";
import planet2 from "assets/images/planet2.png";
import planet3 from "assets/images/planet3.png";
import planet4 from "assets/images/planet4.png";

const ComingSoonObj = () => {
  return (
    <>
      <div className={style.planets}>
        <img className={style.planets} style={{ top: '14%', left: '27%' }} src={planet1} />
        <img className={style.planets} style={{ top: '51%', right: '37%' }} src={planet3} />
        <img className={style.planets} style={{ top: '5%', left: '60%' }} src={planet4} />
      </div>

      <div className={style.article}>
        <img src={bigLogo} alt="bigLogo" />
        <h4 style={{ margin: "1rem 0" }}>
          <span>EXCHANGE</span>
        </h4>
      </div>

      <div className={style.article}>
        <p className={style.paragraph}>
          MilkyWay Exchange is a new one of a kind decentralised trading platform offering a unique vested farming reward system that allows a high APR on staking and ensures the sustainability of the economy. The platform is focused on bringing real value to the community and turning into a true DAO.
        </p>
        <div className={style.btn__groups}>
          <a href="https://t.me/MilkyWayDefi"><button className={style.btn1}>Telegram</button></a>
          <a href="https://docs.milkyway.exchange/"><button className={style.btn1}>Learn More</button></a>
        </div>
      </div>

      <div className={style.article}>
        <h2 style={{ margin: "1rem 0" }}>
          <span>Coming Soon...</span>
        </h2>
      </div>

    </>
  );
};

export default ComingSoonObj;
