import { useState, useEffect, useRef } from 'react'
import {
	Box, Stack, Link, Button, TextField, IconButton,
	Popper, ClickAwayListener, Paper, Grow, MenuItem, MenuList
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { MoreHoriz as MoreIcon } from '@mui/icons-material'
import useResponsive from 'hooks/useResponsive'
import Logo from 'components/Logo'
import { useCallback } from 'react'
import { web3Modal } from 'utils/web3Modal'
import { providers } from 'ethers'
import { useAppContext } from 'context/WalletContext'
import { setupProvider } from 'utils/integrate'
import { ethers } from 'ethers'
import { NetworkId, NETWORK_ID } from 'config/constants/types'
import toast from "react-hot-toast"

const LinkStyle = styled(Link)(() => ({
	color: 'white',
	textDecoration: 'none',
	fontSize: 14,
}));

const ButtonStyle = styled(Button)(() => ({
	backgroundColor: '#4A1062',
	borderRadius: '20px',
	padding: '5.25px 16px',
	textTransform: 'capitalize',
}));

const languages = [
	{ label: 'English', value: 'en' },
];
const options = [
	{ name: 'Swap', url: '/swap' },
	{ name: 'Liquidity', url: '/swap?tab=liquidity' },
	{ name: 'Farms', url: '/farm' },
	{ name: 'Connect Wallet', url: '' }
];

const Header = () => {
	const [appState, setAppState] = useAppContext()
	const { provider, address } = appState

	const isMobile = useResponsive('between', 'sm', 1, 680);
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLButtonElement>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const getSubAddress = (str: string) => {
		return `${str.substring(0, 5)}...${str.substring(
			str.length - 3,
			str.length
		)}`
	}

	const connect = useCallback(async function () {
		try {
			const provider = await web3Modal.connect()
			const web3Provider = new providers.Web3Provider(provider)

			const signer = web3Provider.getSigner()
			const address = await signer.getAddress()
			const network = await web3Provider.getNetwork()

			setAppState({ ...appState, provider: provider, web3Provider: web3Provider, address: address, chainId: network.chainId })
		} catch (e) {

		}
	}, [])

	const disconnect = useCallback(
		async function () {
			await web3Modal.clearCachedProvider()
			if (provider?.disconnect && typeof provider.disconnect === 'function') {
				await provider.disconnect()
			}

			setAppState({ provider: null, web3Provider: null, address: '', chainId: -1 })
		},
		[]
	)

	if (address === undefined) {
		disconnect()
	}

	// Auto connect to the cached provider
	useEffect(() => {
		if (web3Modal.cachedProvider) {
			connect()
		}
	}, [])

	useEffect(() => {
		if (appState.provider?.on) {
			const handleAccountsChanged = (accounts: string[]) => {
				// eslint-disable-next-line no-console
				setAppState({ ...appState, address: accounts[0] })
			}

			const handleDisconnect = (error: { code: number; message: string }) => {
				// eslint-disable-next-line no-console
				console.log('disconnect', error.code, error.message)
				if (error.code !== 1013) {
					disconnect()
				}
			}

			const handleChainChanged = (chainId: number) => {
				if ((parseInt(chainId.toString()) as NetworkId) !== NETWORK_ID) {
					toast.error("You should select the right network.")
				}
			}

			provider.on('accountsChanged', handleAccountsChanged)
			provider.on('disconnect', handleDisconnect)
			provider.on('chainChanged', handleChainChanged)

			if (appState.web3Provider && appState.web3Provider.network) {
				if (appState.web3Provider.network.chainId !== NetworkId.BscMainnet) {
					toast.error("You should select the right network.")
				} else {
					setupProvider(appState)
				}
			}

			// Subscription Cleanup
			return () => {
				if (provider.removeListener) {
					provider.removeListener('accountsChanged', handleAccountsChanged)
					provider.removeListener('disconnect', handleDisconnect)
					provider.removeListener('chainChanged', handleChainChanged)
				}
			}
		} else {
			setupProvider(null)
		}
	}, [appState.provider])

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLLIElement, MouseEvent>,
		index: number,
		url: string
	) => {
		setSelectedIndex(index);
		if (index === 3) {
			appState.web3Provider ? disconnect() : connect();
		} else {
			window.open(url,"_self");
		}
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: Event) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}
		setOpen(false);
	};

	return (
		<Box sx={{
			px: 5,
			py: '14px',
			bgcolor: '#1D062C',
			display: 'flex',
			alignItems: 'center',
		}}>
			<Stack direction="row" spacing={12}>
				<Link href="/">
					<Logo />
				</Link>
				{
					!isMobile && (
						<Stack direction="row" spacing={5}>
							<LinkStyle href="/swap">Swap</LinkStyle>
							<LinkStyle href="/swap?tab=liquidity">Liquidity</LinkStyle>
							<LinkStyle href='/farm'>Farms</LinkStyle>
						</Stack>
					)
				}
			</Stack>
			<Box sx={{ flexGrow: 1 }} />
			{
				!isMobile && (
					<Stack direction="row" spacing={1.5} alignItems="center">
						<ButtonStyle variant='contained' onClick={appState.web3Provider ? disconnect : connect}>{appState.web3Provider && address ? getSubAddress(address as string) : 'Connect Wallet'}</ButtonStyle>
					</Stack>
				)
			}
			<IconButton
				color="secondary"
				sx={{ p: 1 }}
				aria-controls={open ? 'split-button-menu' : undefined}
				aria-expanded={open ? 'true' : undefined}
				aria-label="select merge strategy"
				aria-haspopup="menu"
				onClick={handleToggle}
				ref={anchorRef}
			>
				<MoreIcon />
			</IconButton>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
				style={{ zIndex: 2 }}
				className="smallMenuParent"
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin:
								placement === 'bottom' ? 'center top' : 'center bottom',
						}}
					>
						<Paper className="smallMenu">
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList className="smallMenuChild" id="split-button-menu">
									{options.map((option, index) => (

										<MenuItem
											key={option.name}
											selected={index === selectedIndex}
											onClick={(event) => handleMenuItemClick(event, index, option.url)}
										>
											{

												index === 3 && appState.web3Provider ? 'Disconnect' : option.name
											}

										</MenuItem>
									))}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</Box>
	);
};

export default Header;