import { Typography, Input, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import React from 'react'
import CryptoSelect from './Select'
import useResponsive from 'hooks/useResponsive';

interface FormProps {
	label: string,
	pairValue: string | null,
	balance: number,
	amount: string,
	updatePairValue: (arg: string | null) => void,
	updateAmount: (arg: string) => void,
};

const InputForm = styled('div')(({ theme }) => ({
	marginTop: '10px',
	padding: '10px 20px 5px 20px',
	borderRadius: '14px',
	backgroundColor: '#1D062C',
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'end',

	[theme.breakpoints.up('sm')]: {
		marginLeft: '100px',
	},

	[theme.breakpoints.down('sm')]: {
		width: '100%',
		marginLeft: '0px',
		padding: '15px 5px',
	}
}))

const MaximumValue = styled('div')(() => ({
	fontSize: '12px',
	color: '#4387FC',
	cursor: 'pointer'
}))

const InputStyle = styled(Input)(({ theme }) => ({
	textAlign: 'right',
	input: {
		textAlign: 'right',
	},
	width: '100%',
	color: '#FFFFFF',
	'&::after, &::before': {
		display: 'none'
	},
}));

const Form = ({ label, pairValue, balance, amount, updatePairValue, updateAmount }: FormProps) => {
	const smDown = useResponsive('down', 'sm');
	const [, setValue] = useState<string>('0.0');
	const [, setCurrency] = useState<string | null>()

	const updateCurrency = (cur: string | null): void => {
		setCurrency(cur);
		updatePairValue(cur);
	}

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
		updateAmount(event.target.value);
	};

	const handleMaximunValue = () => {
		setValue(balance.toString())
		updateAmount(balance.toString());
	}

	return (
		<Stack sx={{
			borderRadius: '19px',
			padding: '25px 15px',
			backgroundColor: '#1F0F4A',
			display: 'flex',
			flexDirection: smDown ? 'column' : 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			position: 'relative',
			marginTop: '-10px'
		}}>
			<Typography
				variant="caption"
				sx={{
					color: '#FFFFFF',
					position: 'absolute',
					top: '12px',
					left: '30px',
					fontSize: '11px',
				}}
			>
				{label}:
			</Typography>
			<Typography
				variant="caption"
				sx={{
					color: '#FFFFFF',
					position: 'absolute',
					top: '12px',
					right: '30px',
					fontSize: '11px',
				}}
			>
				Balance: {balance}
			</Typography>
			<CryptoSelect currency={pairValue} updateCurrency={updateCurrency} />
			<InputForm>
				<InputStyle
					type="text"
					value={amount}
					onChange={handleValueChange}
					placeholder="0.0"
				/>
				<MaximumValue onClick={() => handleMaximunValue()}>Maximum</MaximumValue>
			</InputForm>
		</Stack>
	);
};

export default Form;