import { FC } from "react";
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

import Footer from "./footer/footer";
import Navbar from "./navbar/navbar";

const Layout: FC = () => (  
  <Container>
    <Navbar />
    <Outlet />
    <Footer />
  </Container>
);

export default Layout;
