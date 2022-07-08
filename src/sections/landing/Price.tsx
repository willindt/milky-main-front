import { FC, useEffect, useState } from "react";
import { ItemProps } from "types/interface";
import style from "views/home/home.module.css";
import { getCurrentMilkyPrice, getTotalLiquidity, getAllPairsLength } from "utils/integrate";

import planet1 from "assets/images/planet1.png";
import planet2 from "assets/images/planet2.png";
import planet3 from "assets/images/planet3.png";
import planet4 from "assets/images/planet4.png";
const Price = () => {
  const [price, setPrice] = useState<string>('$0.0')
  const [totalValue, setTotalValue] = useState<string>('$0.0')
  const [pairsLength, setPairsLength] = useState<number>(0)
  const getPriceMilky = async () => {
    const price = await getCurrentMilkyPrice()
    setPrice(`$${price.toFixed(4)}`)
  }

  const getTotalPrice = async () => {
    const value = await getTotalLiquidity()
    setTotalValue(`$${value.toFixed(0)}`)
  }

  const getPairsLength = async () => {
    setPairsLength(await getAllPairsLength())
  }

  useEffect(() => {
    getPriceMilky()
    getTotalPrice()
    getPairsLength()
  }, [])

  return (
    <section className={style.grid}>
      <Item amount={price} desc="MILKYWAY Price" src={planet1} />
      <Item amount={totalValue} desc="Total Liquidity" src={planet2} />
      <Item amount="N/A" desc="Total Volume" src={planet3} />
      <Item amount={pairsLength.toString()} desc="Total Pairs" src={planet4} />
    </section>
  );
};

const Item: FC<ItemProps> = ({ amount, desc, src }: ItemProps) => (
  <div className={style.item}>
    <img className={style.planetsCircle} src={src} />
    <h3 style={{ fontSize: "36px", fontWeight: 'bold' }}>{amount}</h3>
    <span>{desc}</span>
  </div>
);

export default Price;
