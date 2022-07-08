import ComingSoonObj from "sections/landing/ComingSoonObj";
import { useEffect } from "react";

//below home page style imported
import style from "../views/coming_soon.module.css";

const ComingSoon = () => {
  useEffect(() => {
    document.querySelector('html')!.style.backgroundPositionY = '5%';
  }, []);


  return (<div className={style.content}>
    <ComingSoonObj />
  </div>)
}

export default ComingSoon