import { FC } from "react";
import { Item4Props } from "types/interface";
import style from "views/home/home.module.css";
import partner_wsg from "assets/images/partners/wsg_white.png";
import partner_uno from "assets/images/partners/uno.png";

let wsg_url = "https://wsg.gg";
let uno_url = "https://app.unore.io/investment"

const Partners = () => {
  return (
    <section className={style.section4} style={{ marginTop: "1rem" }}>
      <div className={style.heading}>
        <h1>Partners</h1>
      </div>
      <div className={style.grid4}>
        <Item4 url={wsg_url} image={partner_wsg} desc="Wall Street Games" />
        
      </div>
    </section>
  );
};

const Item4: FC<Item4Props> = ({ image, desc, url }: Item4Props) => (
  <div>
    <a href={url}>
      <div
        className={style.grid4__item}
        style={{ textAlign: "center", color: "#fff" }}
      >
        
        <div
          style={{
            height: "100px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: '10px',
            color: "#fff",
          }}
        >

          <img style={{ maxHeight: '70px' }} src={image} />
        </div>

      </div>
      <p>{desc}</p>
    </a>
  </div>
);

export default Partners;
