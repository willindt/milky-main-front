export interface ItemProps {
  amount: string;
  desc: string;
  src: string;
}
export interface Item2Props {
  title: string;
  desc: any;
  onClick: () => void;
  styles?: React.CSSProperties;
}
export interface Item3Props {
  icon: string;
  value: string;
  desc: string;
}
export interface Item4Props {
  image: string;
  desc: string;
  url: string;
}
