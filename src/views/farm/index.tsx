import {
    Box, Container, Stack, Divider, TextField, InputAdornment,
    Typography, Table, TableBody, TableCell, TableContainer,
    TableRow, TableHead, Collapse, Button, Grid, CircularProgress,
    Link
} from '@mui/material'
import {styled} from '@mui/material/styles'
import {Search, Help, Key} from '@mui/icons-material'
import {fCurrency, fPercent} from 'utils/numbers'
import useResponsive from 'hooks/useResponsive'
import React, {useState, useEffect, useCallback, useRef} from "react"
import {web3Modal} from 'utils/web3Modal'
import {providers} from 'ethers'
import axios from "axios";

import {
    TOKEN_DATA,
    getPoolDataFromPoint,
    searchPoolData,
    getPairDataFromLpAddr,
    TOKEN_TYPE,
    getPendingMilky,
    unstakeTokensFromPool,
    getCurrentPoolTVL,
    getRewardsPerDay,
    getCurrentPoolAPR,
    getMilkyPair,
    getStakedBalance,
    getCurrentBalanceToUSD,
    getCurrentMilkyPrice
} from 'utils/integrate'

import CustomizedDialogs from 'components/StakeDialog'
import {NetworkId, TypeDialog} from 'config/constants/types'
import {BlockNetworkId} from "config/constants/common"
import {useAppContext} from 'context/WalletContext'

const FarmButtonStyle = styled(Button)(() => ({
    padding: '10px 20px',
    color: '#FFFFFF',
    borderRadius: '14px !important',
    background: 'var(--btnColor2)',
    border: 'none',
    textTransform: 'capitalize',
    marginTop: "20px"
}));

const InputStyle = styled(TextField)(() => ({
    padding: '0px 20px',
    borderRadius: '14px',
    backgroundColor: '#2b0e79',
    width: '100%',
    color: '#FFFFFF',
    '& fieldset': {
        display: 'none',
    },
    '& input, & svg': {
        color: '#FFFFFF',
    },
    '&::after, &::before': {
        display: 'none',
    },
    '.MuiInputBase-root': {
        paddingRight: '0',
        fontFamily: 'DM sans',
    }
}));

const CustomTypography = styled(Typography)(() => ({
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    letterSpacing: '1px'
}))

const TableStyle = styled(Table)(() => ({
    borderCollapse: 'separate',
    borderSpacing: '0px 8px',
    'tr': {
        'td, th': {
            color: '#FFFFFF',
            fontFamily: 'DM sans',
            borderBottom: 'none'
        },
        'th:first-of-type': {
            paddingLeft: 20,
        }
    },
    'thead': {
        '& tr th': {
            fontWeight: '700',
            fontFamily: 'DM sans',
            padding: '3px 16px',
        }
    },
    'tbody': {
        '& tr td': {
            fontFamily: 'DM sans'
        }
    }
    // 'tbody': {
    // 	'tr': {
    // 		margin: '5px 0',
    // 		'&:nth-of-type(odd)': {
    // 			backgroundColor: '#2b0e79',
    // 		},
    // 		'&:nth-of-type(even)': {
    // 			backgroundColor: '#1f0f4a',
    // 		},
    // 		'th': {
    // 			borderRadius: '14px 0 0 14px',
    // 		},
    // 		'td:last-of-type': {
    // 			borderRadius: '0 14px 14px 0',
    // 		}
    // 	}
    // }
}));

const CustomFarmBox = styled(Box)(() => ({
    borderRadius: '14px',
    background: '#2b0e79',
    cursor: 'pointer',
    '&:hover': {
        background: '#1f0f4a'
    },
    color: '#FFFFFF',
    padding: '30px 40px'
}))

interface FarmBoxProps {
    text: string,
    type: boolean,
    point: number,
    farmClicked: (arg: number) => void
};


const FarmBox = ({text, type, point, farmClicked}: FarmBoxProps) => {
    const background = type === false ? '#2b0e79' : 'var(--btnColor2)';
    const [loading, setLoading] = useState(false)
    const points = [0];
    const click = () => {
        farmClicked(point);
    }

    return (
        <CustomFarmBox sx={{background}} onClick={() => click()}>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <CustomTypography>{text}</CustomTypography>
            </Stack>
        </CustomFarmBox>
    );
};

interface poolInterface {
    lpAddr: string,
    tokenA: string,
    tokenB: string,
    allocPoint: number,
    pid: number
}

const getFormattedValue = (number: any) => {
    if (!number) {
        return number;
    }
    var parts = number.toString().split(".");
    const numberPart = parts[0];
    const decimalPart = parts[1];
    const thousands = /\B(?=(\d{3})+(?!\d))/g;
    return numberPart.replace(thousands, ",") + (decimalPart ? "." + decimalPart : "");
};

const Farm = () => {
    const isDesktop = useResponsive('up', 'md');
    const [poolData, setPoolData] = useState<any>([])
    const [poolDataFromScript, setPoolDataFromScript] = useState<any>([])
    const [point, setPoint] = useState<number>(1000);
    const [loading, setLoading] = useState(false)
    const [searchPattern, setSearchPattern] = useState('')

    const getPoolsDataFromScript = async () => {
        const proxy = "https://us-central1-milkyway-b93c5.cloudfunctions.net/app"; // normally in development mode added to package.json

        let config = {
            url: proxy + "/exchange",
            withCredentials: false,
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        };
        let res = await axios(config);
        let data = res.data;

        return data;
    };


    const getPoolsData = async () => {
        setLoading(true);

        //setPoolDataFromScript( await getPoolsDataFromScript())

        let poolData = await getPoolDataFromPoint(point);
        let data = await getPoolsDataFromScript();
        for (let i = 0; i < poolData?.length; i++) {
            console.log(poolData[i].pid);
            if (poolData[i].pid === i) {
                poolData[i]["tvl"] = Number(data[i].tvl);
                poolData[i]["daily"] = Number(data[i].daily);
                poolData[i]["apr"] = Number(data[i].apr);
            }
        }

        setPoolData(poolData)
        setLoading(false);
    }

    const getSearchData = async () => {
        if (searchPattern !== '') {
            setLoading(true)
            setPoolData(await searchPoolData(searchPattern))
            setLoading(false)
        } else {
            getPoolsData()
        }
    }

    useEffect(() => {
        getPoolsData()
    }, [point])

    const farmClicked = async (point: number) => {
        setPoint(point)
    }

    return (
        <Container>
            <Stack direction={isDesktop ? "row" : "column"} spacing={5} mt={5}>
                <Stack
                    spacing={2}
                    sx={{
                        width: isDesktop ? '300px' : '100%',
                    }}
                >
                    <FarmBox text="Your Farms" type={false} point={-1} farmClicked={farmClicked}/>
                    <Divider sx={{my: 1, bgcolor: "#dd38f2 !important"}}/>
                    <Stack spacing={1.5}>
                        <FarmBox key={1} text={`General`} type={true} point={0} farmClicked={farmClicked}/>
                    </Stack>
                </Stack>
                <Box sx={{flexGrow: 1}}>
                    <InputStyle
                        placeholder="Search by name, symbol, address"
                        value={searchPattern}
                        onChange={(e) => setSearchPattern(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && getSearchData()}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Stack direction="row" my={4} spacing={1} alignItems="center" overflow='hidden'>
                        <CustomTypography variant="body2" sx={{color: '#FFFFFF'}}>Farms</CustomTypography>
                        <Divider sx={{width: '100%', my: 1, bgcolor: "#dd38f2 !important"}}/>
                    </Stack>

                    {
                        loading ? (
                            <Stack direction="column" alignItems='center' justifyContent='center' marginTop={4}
                                   marginBottom={4}>
                                <CircularProgress></CircularProgress>
                            </Stack>
                        ) : (
                            <TableContainer>
                                <TableStyle sx={{minWidth: 650}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Pool</TableCell>
                                            <TableCell>TVL</TableCell>
                                            <TableCell>Rewards</TableCell>
                                            <TableCell align="right">APR</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            poolData.map((pool: any, index: number) => (
                                                <Row key={index} index={index} pool={pool}></Row>
                                            ))
                                        }
                                    </TableBody>
                                </TableStyle>
                            </TableContainer>
                        )
                    }
                </Box>
            </Stack>
        </Container>
    );
};

interface RowProps {
    pool: any,
    index: number
}

function Row({pool, index}: RowProps) {
    const [appState, setAppState] = useAppContext()
    const [open, setOpen] = React.useState(false)
    const [openStakeDlg, setOpenStakeDlg] = useState(false)
    const [openUnStakeDlg, setOpenUnStakeDlg] = useState(false)
    const [rewardsMilky, setRewardsMilky] = useState(0.0)
    const [totalRewards, setTotalRewards] = useState({instant: 0.0, locked: 0.0, unlocked: 0.0, total: 0.0})
    const [tvl, setTVL] = useState(pool.tvl ? pool.tvl : 0.0)
    const [apr, setAPR] = useState(pool.apr ? pool.apr : 0.0)
    const [rewards, setRewards] = useState(pool.daily ? pool.daily : 0.0)
    const [loading, setLoading] = useState(false)
    const [stakedUSD, setStakedUSD] = useState(0.0)
    const [stakedAmount, setStakedAmount] = useState(0.0)

    const connect = useCallback(async function () {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const provider = await web3Modal.connect()

        // We plug the initial `provider` into ethers.js and get back
        // a Web3Provider. This will add on methods from ethers.js and
        // event listeners such as `.on()` will be different.
        const web3Provider = new providers.Web3Provider(provider)

        const signer = web3Provider.getSigner()
        const address = await signer.getAddress()
        const network = await web3Provider.getNetwork()

        if (network.chainId === NetworkId.BscTestnet) {
            setAppState({
                ...appState,
                provider: provider,
                web3Provider: web3Provider,
                address: address,
                chainId: network.chainId
            })
        }
    }, [])

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connect()
        }
    }, [connect])

    async function handleClickStake() {
        if (appState.address !== '' && pool.tokenA && pool.tokenB) {
            setOpenStakeDlg(true);
        }
    }

    async function handleGetRewards() {
        setTVL(await getCurrentPoolTVL(pool.pid))
        setRewards(await getRewardsPerDay(pool.pid))
    }

    async function handleGetApr() {
        setAPR(await getCurrentPoolAPR(tvl, rewards))
    }

    async function handleClickUnstake() {
        if (appState.address !== '' && pool.tokenA && pool.tokenB) {
            setOpenUnStakeDlg(true);
        }
    }

    async function handleStakedBalance() {
        const lpBalance = await getStakedBalance(pool.pid)
        setStakedAmount(lpBalance.balance)

        const usd = await getCurrentBalanceToUSD(lpBalance.balance as number, pool.address)
        setStakedUSD(usd)
    }

    async function handlePendingMilky(pid: number, lpAddr: string) {
        const pendingMilky = await getPendingMilky(pid, lpAddr)
        if (pendingMilky !== undefined) {
            setRewardsMilky(pendingMilky.rewards)
            setTotalRewards({
                instant: pendingMilky.instant,
                locked: pendingMilky.locked,
                unlocked: pendingMilky.unlocked,
                total: pendingMilky.rewards
            })
        }
    }

    async function handleHarvest() {
        setLoading(true)
        await unstakeTokensFromPool(index, pool.address, '0');
        setRewardsMilky(0.0)
        setLoading(false)
    }

    async function handleGetPoolData(lpAddr: string) {
        // setDataFetching(true)
        setTVL(await getCurrentPoolTVL(pool.pid))
        setRewards(await getRewardsPerDay(pool.pid))
        setAPR(await getCurrentPoolAPR(tvl, rewards))
        // setDataFetching(false)
    }

    function useInterval(callback: any, delay: any) {
        const savedCallback: any = useRef();

        // Remember the latest function.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useEffect(() => {
        if (pool.address) {
            handleGetPoolData(pool.address)
            if (appState.address !== '') {
                handlePendingMilky(pool.pid, pool.address)
                handleStakedBalance()
            }
        }
    }, [])

    useInterval(() => {
        if (pool.address) {
            handleGetPoolData(pool.address)
            if (appState.address !== '') {
                handlePendingMilky(pool.pid, pool.address)
                handleStakedBalance()
            }
        }
    }, 5000);

    const handleStakeOpen = (state: boolean): void => {
        setOpenStakeDlg(state)
    }

    const handleUnstakeOpen = (state: boolean): void => {
        setOpenUnStakeDlg(state)
    }

    return (
        <React.Fragment>
            <TableRow
                key={index}
                onClick={() => setOpen(!open)}
                sx={{
                    backgroundColor: '#2b0e79',
                    '&:hover': {
                        backgroundColor: '#1f0f4a',
                        cursor: 'pointer'
                    },
                    height: '100px'
                }}
            >
                <TableCell component="th" scope="row"
                           sx={{borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px'}}>
                    <Stack direction="row" alignItems='center' spacing={3}>
                        <Box width="60px">
                            {
                                pool.address === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? (
                                    <img
                                        loading="lazy"
                                        width="30"
                                        src={TOKEN_DATA[TOKEN_TYPE.MILKY].image}
                                        alt={`Flag of ${TOKEN_DATA[TOKEN_TYPE.MILKY].label}`}
                                        style={{display: 'inline-flex', paddingRight: '4px'}}
                                    />
                                ) : pool.tokenA && pool.tokenB && (
                                    <>
                                        <img
                                            loading="lazy"
                                            width="30"
                                            src={TOKEN_DATA[pool.tokenA as TOKEN_TYPE].image}
                                            alt={`Flag of ${TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}`}
                                            style={{display: 'inline-flex', paddingRight: '4px'}}
                                        />
                                        <img
                                            loading="lazy"
                                            width="30"
                                            src={TOKEN_DATA[pool.tokenB as TOKEN_TYPE].image}
                                            alt={`Flag of ${TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}`}
                                            style={{display: 'inline-flex', paddingRight: '4px'}}
                                        />
                                    </>
                                )
                            }
                        </Box>
                        <Stack>
                            {
                                pool.address === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? (
                                    <span style={{display: ' flex', fontWeight: "700"}}>
										{TOKEN_DATA[TOKEN_TYPE.MILKY].label}
                                        <Link style={{textDecoration: 'none', color: 'white', cursor: 'pointer'}}
                                              onClick={(e) => {
                                                  e.stopPropagation()
                                              }} target="_blank"
                                              href={`/swap?tab=swap&pair2=${TOKEN_DATA[TOKEN_TYPE.MILKY].label.toLowerCase()}`}>
											<CustomTypography fontSize={16} fontWeight="700">
												<svg style={{fill: "white", marginLeft: '6px', position: 'relative'}}
                                                     viewBox="0 0 24 24" color="primary" width="20px"
                                                     xmlns="http://www.w3.org/2000/svg">
													<path
                                                        d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z">
													</path>
												</svg>
											</CustomTypography>
										</Link>
									</span>
                                ) : pool.tokenA && pool.tokenB && (
                                    <span style={{display: ' flex', fontWeight: "700"}}>
										{TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}/{TOKEN_DATA[pool.tokenB as TOKEN_TYPE].label}
                                        <Link style={{textDecoration: 'none', color: 'white', cursor: 'pointer'}}
                                              onClick={(e) => {
                                                  e.stopPropagation()
                                              }} target="_blank"
                                              href={`/swap?tab=liquidity&pair1=${pool.tokenA}&pair2=${pool.tokenB}`}>
											<CustomTypography fontSize={16} fontWeight="700">
												<svg style={{fill: "white", marginLeft: '6px', position: 'relative'}}
                                                     viewBox="0 0 24 24" color="primary" width="20px"
                                                     xmlns="http://www.w3.org/2000/svg">
													<path
                                                        d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z">
													</path>
												</svg>
											</CustomTypography>
										</Link>
									</span>
                                )
                            }
                            <CustomTypography variant="body2" color="secondary"
                                              fontSize={12}>MilkyWay</CustomTypography>
                            <CustomTypography variant="body2" color="secondary" fontSize={12}>Farm</CustomTypography>
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell>${tvl.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box>
                            <img
                                loading="lazy"
                                width="30"
                                src={TOKEN_DATA[TOKEN_TYPE.MILKY].image}
                                alt={`Flag of ${TOKEN_DATA[TOKEN_TYPE.MILKY].label}`}
                                style={{display: 'inline-flex', paddingRight: '4px'}}
                            />
                        </Box>
                        <CustomTypography fontSize={12}>
                            {rewards.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })} MILKY / DAY
                        </CustomTypography>
                    </Stack>
                </TableCell>
                <TableCell align="right" sx={{borderTopRightRadius: '14px', borderBottomRightRadius: '14px'}}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <CustomTypography fontSize={14}>
                            {apr.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}%
                        </CustomTypography>
                        <Help/>
                    </Stack>
                    <CustomTypography fontSize={14} sx={{opacity: 0.3}}>
                        annualized
                    </CustomTypography>
                </TableCell>
            </TableRow>
            <TableRow sx={{
                backgroundColor: '#2b0e79'
            }}>
                <TableCell style={{paddingBottom: 0, paddingTop: 0, borderRadius: '14px'}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container justifyContent="space-between" paddingTop={2} paddingBottom={2}>
                            <Grid item borderRadius={3} padding={2} border={2} borderColor={'#fff'} xs={6}>
                                <Box>
                                    <CustomTypography sx={{color: '#fff'}}>
                                        MILKY EARNED
                                    </CustomTypography>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Stack flexDirection='column' width='100%'>
                                        <Grid container padding={1}>
                                            <Grid item xs={12}>
                                                <CustomTypography sx={{color: '#fff'}}>
                                                    <b>Available:</b> {(totalRewards.instant + totalRewards.unlocked).toFixed(2)} MILKY
                                                </CustomTypography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomTypography sx={{color: '#fff'}}>
                                                    <b>Locked:</b> {totalRewards.locked.toFixed(2)} MILKY
                                                </CustomTypography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <CustomTypography sx={{color: '#fff'}}>
                                                    <b>Total:</b> {totalRewards.total.toFixed(2)} MILKY
                                                </CustomTypography>
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    <Button
                                        disabled={((totalRewards.instant > 0 || totalRewards.unlocked > 0) && !loading) ? false : true}
                                        variant="contained" onClick={handleHarvest}>Harvest</Button>
                                </Box>
                            </Grid>
                            <Grid item borderRadius={3} padding={2} border={2} borderColor={'#fff'} xs={5}>
                                <Stack direction="row" alignItems="center">
                                    <CustomTypography sx={{color: '#fff'}}>
                                        Staked: {stakedAmount.toFixed(2)}
                                    </CustomTypography>
                                    {
                                        pool.address === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? (
                                            <CustomTypography
                                                paddingLeft={1}>{TOKEN_DATA[TOKEN_TYPE.MILKY].label}</CustomTypography>
                                        ) : pool.tokenA && pool.tokenB && (
                                            <CustomTypography
                                                paddingLeft={1}>{TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}/{TOKEN_DATA[pool.tokenB as TOKEN_TYPE].label}</CustomTypography>
                                        )
                                    }
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    <CustomTypography sx={{color: '#fff'}}>
                                        USD Value: (${stakedUSD.toFixed(2)})
                                    </CustomTypography>
                                </Stack>
                                <Stack direction="row" alignItems="center">
                                    {
                                        appState.address === '' ? (
                                            <Button fullWidth variant="contained" onClick={connect}>CONNECT
                                                WALLET</Button>
                                        ) : (
                                            <>
                                                <FarmButtonStyle fullWidth variant="contained"
                                                                 onClick={handleClickStake}>Stake</FarmButtonStyle>
                                                <FarmButtonStyle fullWidth variant="contained"
                                                                 onClick={handleClickUnstake}
                                                                 sx={{marginLeft: '8px'}}>Unstake</FarmButtonStyle>
                                            </>
                                        )
                                    }
                                </Stack>
                                {
                                    pool.tokenA && pool.tokenB && (
                                        <>
                                            <CustomizedDialogs open={openStakeDlg} pid={index} lpAddr={pool.address}
                                                               type={TypeDialog.STAKE}
                                                               pairType={pool.address === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? `${TOKEN_DATA[TOKEN_TYPE.MILKY].label}` : `${TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}-${TOKEN_DATA[pool.tokenB as TOKEN_TYPE].label} LP`}
                                                               handleOpen={handleStakeOpen}/>
                                            <CustomizedDialogs open={openUnStakeDlg} pid={index} lpAddr={pool.address}
                                                               type={TypeDialog.UNSTAKE}
                                                               pairType={pool.address === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? `${TOKEN_DATA[TOKEN_TYPE.MILKY].label}` : `${TOKEN_DATA[pool.tokenA as TOKEN_TYPE].label}-${TOKEN_DATA[pool.tokenB as TOKEN_TYPE].label} LP`}
                                                               handleOpen={handleUnstakeOpen}/>
                                        </>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default Farm;
