import { Outlet } from 'react-router-dom';
import { Stack, Box } from '@mui/material';
import { Toaster } from "react-hot-toast";

import Header from './header';
import Footer from './footer';

const MainLayout = () => {
	return (
		<>
			<Stack sx={{ minHeight: '100vh' }} className="main-layout">
				<Header />
				<Outlet />
				<Box sx={{ flexGrow: 1 }} />
				<Footer />
			</Stack>
			<Toaster
				position="top-right"
				reverseOrder={false}
				gutter={8}
				containerClassName=""
				containerStyle={{}}
				toastOptions={{
					// Define default options
					className: "",
					duration: 3000,
					style: {
						background: "#363636",
						color: "#fff",
					},
					// Default options for specific types
					success: {
						duration: 3000,
						theme: {
							primary: "green",
							secondary: "black",
						},
					},
				}}
			/>
		</>
	);
};

export default MainLayout;