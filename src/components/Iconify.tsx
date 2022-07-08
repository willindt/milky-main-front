// icons
import { Icon } from '@iconify/react';
// @mui
import { Box, SxProps } from '@mui/material';

interface props {
	icon: string,
	sx: SxProps,
};

export default function Iconify({ icon, sx }: props) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} />;
}
