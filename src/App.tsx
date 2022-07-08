import { useEffect } from "react";
import WebFont from "webfontloader";
import {
  BrowserRouter
} from "react-router-dom";

import "./assets/css/main.css";
import Routes from './routes';
import { useOnboard } from "use-onboard";
import { BlockNetworkId } from "config/constants/common";
import { AppContextProvider } from 'context/WalletContext';

const App = () => {
  const { isWalletSelected, onboard } = useOnboard({
    options: {
      networkId: BlockNetworkId,
    }
  })

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Chilanka", "Times New Roman"],
      },
    });

  }, []);

  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
