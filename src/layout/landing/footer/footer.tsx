import { FC } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import logo from "assets/images/logo.png";
import style from "./footer.module.css";

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme: any) =>
          theme.palette.mode === "dark" ? "#101010" : "grey.100",
        color: (theme: any) =>
          theme.palette.mode === "dark" ? "grey.300" : "grey.800",
        border: "1px solid",
        borderColor: (theme: any) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

const Footer = () => {
  return (
    <div style={{ width: "100%", borderTop: "1px solid silver", fontFamily: 'Open Sans' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: 1,
          borderRadius: 1,
          flexWrap: 'wrap',
        }}
      >
        <Item
          style={{
            width: "40%",
            background: "transparent",
            border: "none",
            color: "#fff",
          }}
        >
          <img src={logo} alt="logo" style={{ marginBottom: '1rem' }} />

          <p>
            <small style={{ fontWeight: 'lighter', fontSize: '12px' }}>
            MilkyWay Exchange is a new one of a kind decentralised trading platform offering a unique vested farming reward system that allows a high APR on staking and ensures the sustainability of the economy.
            </small>
          </p>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mt: 2,
            }}
          >
            <a target="_blank" href="https://twitter.com/MilkyWayDefi"><img
              src="/icons/tw.svg"
              alt="tw"
              style={{ marginRight: "0.5rem" }}
              className={style.btn}
            /></a>
            <a target="_blank" href="https://t.me/MilkyWayDefi"><img
              src="/icons/tg.svg"
              alt="tg"
              style={{ marginRight: "0.5rem" }}
              className={style.btn}
            /></a>
            <a target="_blank" href="https://docs.milkyway.exchange">
              <img src="/icons/m.svg" alt="m" className={style.btn} /></a>
          </Box>
        </Item>

        <FooterItem title="PRODUCTS" data={items1} />
        <FooterItem title="SUPPORT" data={items2} />
        <FooterItem title="RESOURCES" data={items3} />
      </Box >
    </div >
  );
};

const items1 = [
  {
    title: "Exchange",
    url: "/swap",
  },
  {
    title: "Farms",
    url: "/farm",
  },
];

const items2 = [
  {
    title: "Tutorials",
    url: "https://docs.milkyway.exchange/products/exchange",
  },
  {
    title: "Documentation",
    url: "https://docs.milkyway.exchange/",
  },
  {
    title: "Chat",
    url: "https://t.me/MilkyWayDefi",
  },
];

const items3 = [
  {
    title: "Get started",
    url: "https://docs.milkyway.exchange/how-to-start/buy",
  },
  {
    title: "Token",
    url: "https://bscscan.com/token/",
  },
];

interface FooterItemProps {
  title: string;
  data: any;
}

const FooterItem: FC<FooterItemProps> = ({ title, data }: FooterItemProps) => (
  <Item style={{ background: "transparent", border: "none" }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        borderRadius: 1,
      }}
    >
      <p
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        {title}
      </p>
      {data?.map((item: any, index: number) => (
        <Item
          key={index}
          style={{
            background: "transparent",
            border: "none",
            color: "#e3e3e3",
            padding: "0",
            margin: "0",
            marginBottom: "8px",
            fontSize: "11px",
            fontWeight: "normal",
          }}
        >
          <a href={item.url}>{item.title}</a>
        </Item>
      ))}
    </Box>
  </Item>
);

export default Footer;
