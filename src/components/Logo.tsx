import { Box, SxProps } from "@mui/material";

import logoImage from "assets/images/logo.png";

interface LogoProps {
	sx?: SxProps,
};

const Logo = ({sx}: LogoProps) => {
	return (
		<Box sx={{
			width: 120,
			position: 'relative',
			'&::after': {
				content: "'APP'",
				position: 'absolute',
				right: '-35px',
				top:'-4px',
				color: '#dd38f2',
				fontStyle: 'italic',
				fontSize: '18px',
			},
			...sx
		}}>
			<img src={logoImage} alt="Logo" />
		</Box>
	);
};

export default Logo;