import { FC } from "react";
import { Item2Props } from "types/interface";
import style from "views/home/home.module.css";
import smallLogo from "assets/images/star.png";

import planet1 from "assets/images/Planet1.svg";
import planet2 from "assets/images/Planet2.svg";
import planet3 from "assets/images/Planet3.svg";
import planet4 from "assets/images/Planet4.svg";
import planet5 from "assets/images/Planet5.svg";

const Exchange = () => {
  return (
    <section className={style.section2}>
      <div className={style.heading}>
        <h1>Exchange Properties</h1>
      </div>

      <div style={{ position: "relative", height: "50rem" }} className={style.itemsWrapper}>
        <Item2
          title="Galaxies"
          desc="Yield farming lets users that are providing liquidity earn MILKY rewards by locking their LP tokens into a smart contract."
          onClick={() => goTo("/farm")}
          styles={{ position: "absolute", top: "15em", left: "-37rem", backgroundImage: `url(${planet1})` }}
        />
        <div
          className={style.grid2__item}
          style={{
            background: "transparent",
            position: "absolute",
            top: "22rem",
            left: "-24.5rem",
            border: "unset",
            width: "732px",
            zIndex: "-1"
          }}
        >
          <img src={smallLogo} alt="smallLogo" />
        </div>
        <Item2
          title="Planetary Pools"
          desc="Providing liquidity will get you LP Tokens, which will earn you rewards in the form of trading fees for making sure there's always liquidity for the exchange to use."
          onClick={() => goTo("/farm")}
          styles={{ position: "absolute", top: "2rem", right: "-9em", backgroundImage: `url(${planet2})` }}
        />
        <Item2
          title="Exchange"
          desc="MilkyWay lets users trade without the need to go through a Centralized Exchange. Everything you do on MilkyWay is routed directly through your own wallet."
          onClick={() => goTo("/swap")}
          styles={{ position: "absolute", bottom: "-6rem", left: "-24rem", backgroundImage: `url(${planet3})` }}
        />
        <Item2
          title="Tokenomics"
          desc={ <p><b>Initial supply:</b><br /><span style={{ marginBottom: "5px", padding: "0", display: "block" }}>29,965,318 MILKY</span><b>Initial Launch Price:</b><br /><span style={{ marginBottom: "5px", padding: "0", display: "block" }}>0.005 USD</span><b>Initial Market Capitalization:</b><br /><span style={{ padding: "0", display: "block" }}>149.826,59 USD</span></p> }
          onClick={() => goTo("https://docs.milkyway.exchange/tokenomics")}
          styles={{ position: "absolute", bottom: "15rem", right: "-35rem", backgroundImage: `url(${planet4})` }}
        />
        <Item2
          title="Roadmap"
          desc={ <p>- Backend Subgraph<br/>- Analytics Dashboard<br/>- Pair explorer<br/>- Aggregator Integration<br/>- Lottery<br/>- DAO<br/>- Multi-chain integration</p> }
          onClick={() => goTo("https://docs.milkyway.exchange/roadmap")}
          styles={{
            position: "absolute",
            bottom: "-6rem",
            right: "-22rem",
            backgroundImage: `url(${planet5})`
          }}
        />
      </div>
    </section>
  );
};

const Item2: FC<Item2Props> = ({
  title,
  desc,
  onClick,
  styles,
}: Item2Props) => (
  <div className={style.grid2__item} style={styles ? styles : {}}>
    <h3>{title}</h3>
    <span>{desc}</span>
    <button onClick={onClick} className={style.addBtn}>
      Enter
    </button>
  </div>
);

function goTo(link: any) {
  window.open(link, '_blank')?.focus();
}


export default Exchange;
