import Milky from 'config/contracts/Milky'
import MilkyRouter from 'config/contracts/MilkyRouter'
import MilkyFactory from 'config/contracts/MilkyFactory'
import MilkyPair from 'config/contracts/MilkyPair'
import MasterChef from 'config/contracts/MasterChef'
import IERC20 from 'config/contracts/IERC20'
import AggregatorV3 from 'config/contracts/AggregatorV3'
import { str2BigNumber } from './numbers'
import toast from "react-hot-toast"
import {
    BigNumber,
    Contract,
    ContractReceipt,
    ethers,
} from "ethers"

import { ContractInformation, NetworkId } from 'config/constants/types'
import BNB from 'config/contracts/BNB'
import BUSD from 'config/contracts/BUSD'
import USDT from 'config/contracts/USDT'
import WSG from 'config/contracts/WSG'

import milkyLogo from "assets/images/milky.png"
import bnbLogo from "assets/images/bnb.png"
import busdLogo from "assets/images/busd.png"
import wsgLogo from "assets/images/wsg.png"
import usdtLogo from "assets/images/usdt.png"

import { NetworkRPC } from 'config/constants/common'

export enum TOKEN_TYPE {
    BNB = 'bnb',
    MILKY = 'milky',
    BUSD = 'busd',
    WSG = 'wsg',
    USDT = 'usdt',
}

export const TOKEN_LIST = [
    TOKEN_TYPE.MILKY,
    TOKEN_TYPE.BNB,
    TOKEN_TYPE.BUSD,
    TOKEN_TYPE.USDT,
    TOKEN_TYPE.WSG
]

export const TOKEN_DATA = {
    [TOKEN_TYPE.MILKY as TOKEN_TYPE]: {
        value: 'milky',
        label: 'MILKY',
        address: Milky.address[getNetworkId()],
        image: milkyLogo,
        chainlink: ''
    },
    [TOKEN_TYPE.BNB as TOKEN_TYPE]: {
        value: 'bnb',
        label: 'BNB',
        address: BNB.address[getNetworkId()],
        image: bnbLogo,
        chainlink: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE'
    },
    [TOKEN_TYPE.BUSD as TOKEN_TYPE]: {
        value: 'busd',
        label: 'BUSD',
        address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        image: busdLogo,
        chainlink: '0xcBb98864Ef56E9042e7d2efef76141f15731B82f'
    },
    [TOKEN_TYPE.USDT as TOKEN_TYPE]: {
        value: 'usdt',
        label: 'USDT',
        address: '0x55d398326f99059fF775485246999027B3197955',
        image: usdtLogo,
        chainlink: '0xB97Ad0E74fa7d920791E90258A6E2085088b4320'
    },
    [TOKEN_TYPE.WSG as TOKEN_TYPE]: {
        value: 'wsg',
        label: 'WSG',
        address: '0xA58950F05FeA2277d2608748412bf9F802eA4901',
        image: wsgLogo,
        chainlink: ''
    }
}

export const TOKEN_PAIR = [
    {
        value: 'milky/bnb',
        label: 'MILKY/BNB',
        key0: { value: TOKEN_TYPE.MILKY, label: 'MILKY', image: milkyLogo },
        key1: { value: TOKEN_TYPE.BNB, label: 'BNB', image: bnbLogo }
    },
    {
        value: 'busd/bnb',
        label: 'BUSD/BNB',
        key0: { value: TOKEN_TYPE.BUSD, label: 'BUSD', image: busdLogo },
        key1: { value: TOKEN_TYPE.BNB, label: 'BNB', image: bnbLogo }
    },
    {
        value: 'wsg/bnb',
        label: 'WSG/BNB',
        key0: { value: TOKEN_TYPE.WSG, label: 'WSG', image: wsgLogo },
        key1: { value: TOKEN_TYPE.BNB, label: 'BNB', image: bnbLogo }
    },
    {
        value: 'usdt/busd',
        label: 'USDT/BUSD',
        key0: { value: TOKEN_TYPE.USDT, label: 'USDT', image: usdtLogo },
        key1: { value: TOKEN_TYPE.BUSD, label: 'BUSD', image: busdLogo }
    },
    /* {
        value: 'milky/wsg',
        label: 'MILKY/WSG',
        key0: { value: TOKEN_TYPE.MILKY, label: 'MILKY', image: milkyLogo },
        key1: { value: TOKEN_TYPE.WSG, label: 'WSG', image: wsgLogo }
    } */
]

export const CONTRACT_TABLE = {
    [TOKEN_TYPE.BNB]: BNB,
    [TOKEN_TYPE.MILKY]: Milky,
    [TOKEN_TYPE.BUSD]: BUSD,
    [TOKEN_TYPE.USDT]: USDT,
    [TOKEN_TYPE.WSG]: WSG,
} as {
        [key in TOKEN_TYPE]: ContractInformation
    }

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

var walletProvider: ethers.providers.Web3Provider
var JsonProvider = new ethers.providers.JsonRpcProvider(
    NetworkRPC[getNetworkId()] as string
)

const getDeadlineTime = async (deadline: number) => {
    const blockNumber = await JsonProvider.getBlockNumber()
    const timeStamp = await (await JsonProvider.getBlock(blockNumber)).timestamp
    return timeStamp + deadline * 60
}

export function setupProvider(userState: any) {
    if (userState != null) {
        walletProvider = new ethers.providers.Web3Provider(
            userState.provider
        )

        JsonProvider = new ethers.providers.JsonRpcProvider(
            NetworkRPC[getNetworkId()] as string
        )
    }
}

export function getNetworkId() {
    return (walletProvider && walletProvider.network ? walletProvider.network.chainId : NetworkId.BscMainnet) as NetworkId
}

export async function getAddress() {
    try {
        return walletProvider ? (await walletProvider.getSigner().getAddress()).toString() : ''
    } catch (e) {
        return ''
    }
}

export async function getBalance() {
    try {
        return walletProvider ? (await walletProvider.getBalance(await getAddress())).toString() : '0'
    } catch (e) {
        return '0'
    }
}

export function getSigner() {
    try {
        return walletProvider ? walletProvider.getSigner() : undefined
    } catch (e) {
        return undefined
    }
}

export async function getDecimalFunc(token: TOKEN_TYPE): Promise<number> {
    if (!CONTRACT_TABLE[token]) return 0

    const contract = new ethers.Contract(
        CONTRACT_TABLE[token].address[getNetworkId()],
        CONTRACT_TABLE[token].abi,
        JsonProvider
    )

    try {
        return await contract.decimals()
    } catch {
        return 0
    }
}

export async function getPairData() {
    const contractFactory = new ethers.Contract(
        MilkyFactory.address[getNetworkId()],
        MilkyFactory.abi,
        JsonProvider
    )

    const result = []
    for (let i = 0; i < TOKEN_PAIR.length; i++) {
        const tokenPair = TOKEN_PAIR[i]
        if (!TOKEN_DATA[tokenPair.key0.value] ||
            !TOKEN_DATA[tokenPair.key1.value] ||
            TOKEN_DATA[tokenPair.key0.value].address === '' ||
            TOKEN_DATA[tokenPair.key1.value].address === '') {
            continue
        }
        let pairAddress = ZERO_ADDRESS

        try {
            pairAddress = await contractFactory.getPair(TOKEN_DATA[tokenPair.key0.value].address, TOKEN_DATA[tokenPair.key1.value].address) as string
        } catch { }

        if (pairAddress !== ZERO_ADDRESS) {
            const contractPair = new ethers.Contract(
                pairAddress,
                MilkyPair.abi,
                JsonProvider
            )

            let balance = BigNumber.from(0)

            try {
                balance = await contractPair.balanceOf(getAddress()) as BigNumber
            } catch { }

            if (!balance.isZero()) {
                result.push(tokenPair)
            }
        }
    }

    return result
}

export async function getDecimalToken(token: string): Promise<number> {
    const contract = new ethers.Contract(
        token,
        IERC20.abi,
        JsonProvider
    )

    try {
        return await contract.decimals()
    } catch {
        return 0
    }
}

export async function getLpData(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE, address: string): Promise<any> {
    if (!CONTRACT_TABLE[tokenA] || !CONTRACT_TABLE[tokenB]) return null

    const pairAddress = await getPairAddress(tokenA, tokenB)
    const pairContract = new ethers.Contract(
        pairAddress,
        MilkyPair.abi,
        JsonProvider
    )

    const { _reserve0, _reserve1 } = await pairContract.getReserves()

    const contract = new ethers.Contract(
        MilkyFactory.address[getNetworkId()],
        MilkyFactory.abi,
        JsonProvider
    )

    const addressA = CONTRACT_TABLE[tokenA].address[getNetworkId()]
    const addressB = CONTRACT_TABLE[tokenB].address[getNetworkId()]

    let lpAddress = ''

    try {
        lpAddress = await contract.getPair(addressA, addressB)
    } catch { }

    const lpContract = new ethers.Contract(
        lpAddress,
        MilkyPair.abi,
        JsonProvider
    )

    let lpBalance = '0'

    try {
        lpBalance = await lpContract.balanceOf(address)
    } catch { }

    let lpTotalSupply = '1'

    try {
        lpTotalSupply = await lpContract.totalSupply()
    } catch { }

    const decimals = await getDecimalToken(lpAddress)

    let _reserveA = 0.0, _reserveB = 0.0
    let token0 = ''

    try {
        token0 = await pairContract.token0()
    } catch { }

    if (addressA === token0) {
        _reserveA = formatDecimals(_reserve1, await getDecimalToken(addressB))
        _reserveB = formatDecimals(_reserve0, await getDecimalToken(addressA))
    } else {
        _reserveA = formatDecimals(_reserve1, await getDecimalToken(addressA))
        _reserveB = formatDecimals(_reserve0, await getDecimalToken(addressB))
    }
    const data: any = {
        lpRealBalance: lpBalance,
        lpBalance: formatDecimals(lpBalance, decimals).toString(),
        lpTotalSupply: formatDecimals(lpTotalSupply, decimals).toString(),
        reserveA: _reserveA,
        reserveB: _reserveB
    }

    return data
}

export async function getPairAddress(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE): Promise<string> {
    if (!CONTRACT_TABLE[tokenA]) return ''
    if (!CONTRACT_TABLE[tokenB]) return ''

    const contract = new ethers.Contract(
        MilkyFactory.address[getNetworkId()],
        MilkyFactory.abi,
        JsonProvider
    )

    const address0 = CONTRACT_TABLE[tokenA].address[getNetworkId()]
    const address1 = CONTRACT_TABLE[tokenB].address[getNetworkId()]

    try {
        return await contract.getPair(address0, address1)
    } catch {
        return ''
    }
}

export async function getRateFromPair(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE): Promise<number> {
    if (!CONTRACT_TABLE[tokenA]) return 0
    if (!CONTRACT_TABLE[tokenB]) return 0

    const address0 = CONTRACT_TABLE[tokenA].address[getNetworkId()]
    const address1 = CONTRACT_TABLE[tokenB].address[getNetworkId()]

    const decimals0 = await getDecimalToken(address0);
    const decimals1 = await getDecimalToken(address1);

    const pairAddress = await getPairAddress(tokenA, tokenB) as string

    if (pairAddress === ZERO_ADDRESS) {
        return 0
    }

    const pairContract = new ethers.Contract(
        pairAddress,
        MilkyPair.abi,
        JsonProvider
    )

    let token0 = ZERO_ADDRESS

    try {
        token0 = await pairContract.token0() as string
    } catch { }

    if (token0 === ZERO_ADDRESS) {
        return 0
    }
    const { _reserve0, _reserve1 } = await pairContract.getReserves()

    if (BigNumber.from(_reserve0).isZero() || BigNumber.from(_reserve1).isZero()) {
        return 0
    } else {
        let result = 0
        if (address0 === token0) {
            result = formatDecimals(_reserve0, decimals0) / formatDecimals(_reserve1, decimals1)
        } else {
            result = formatDecimals(_reserve1, decimals1) / formatDecimals(_reserve0, decimals0)
        }
        return result
    }
}

export async function approve(address: string, to: string, amount: string | BigNumber, decimal: number) {
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        address,
        IERC20.abi,
        getSigner()
    )

    const amountBigNumber = amount instanceof BigNumber ? amount : str2BigNumber(amount, decimal)

    try {
        let tx = await contract.approve(to, amountBigNumber)
        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Token approved successfully.")
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient funds in your wallet.")
                break
            default:
                toast.error("Token approve failed.")
                break
        }
    }
}

export async function approveLP(lpToken: string, amount: string | BigNumber) {
    await approve(lpToken, MasterChef.address[getNetworkId()], amount, await getDecimalToken(lpToken))
}

export async function approveToken(token: TOKEN_TYPE, amount: string | BigNumber) {
    if (!CONTRACT_TABLE[token] || !CONTRACT_TABLE[token]) return
    await approve(CONTRACT_TABLE[token].address[getNetworkId()], MilkyRouter.address[getNetworkId()], amount, await getDecimalFunc(token))
}

export async function getPairDataFromLpAddr(lpAddr: string): Promise<any> {
    const contract = new ethers.Contract(
        lpAddr,
        MilkyPair.abi,
        JsonProvider
    )

    let token0 = '', token1 = ''

    try {
        token0 = await contract.token0() as string
    } catch { }

    try {
        token1 = await contract.token1() as string
    } catch { }

    let tokenA = '', tokenB = ''

    for (let i = 0; i < TOKEN_LIST.length; i++) {
        const tokenData = TOKEN_DATA[TOKEN_LIST[i]]
        if (tokenData.address === token0) {
            tokenA = tokenData.value ? tokenData.value : ''
        }
        if (tokenData.address === token1) {
            tokenB = tokenData.value ? tokenData.value : ''
        }
    }

    return {
        tokenA: tokenA,
        tokenB: tokenB
    }
}

export async function getRewardsPerDay(pid: number) {
    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )

    let totalAllocPoint = BigNumber.from(0)

    try {
        totalAllocPoint = await contract.totalAllocPoint() as BigNumber
    } catch { }

    if (totalAllocPoint.isZero()) {
        return 0
    }

    const pool = await contract.poolInfo(pid)
    const latestBlockNumber = await JsonProvider.getBlockNumber()
    const timeDuration = (await JsonProvider.getBlock(latestBlockNumber)).timestamp - (await JsonProvider.getBlock((pool.lastRewardBlock as BigNumber).toNumber())).timestamp

    let multiplier = BigNumber.from(0), milkyPerBlock = BigNumber.from(0)
    try {
        multiplier = await contract.getMultiplier(pool.lastRewardBlock, latestBlockNumber) as BigNumber
    } catch { }

    try {
        milkyPerBlock = await contract.milkyPerBlock() as BigNumber
    } catch { }

    const result = multiplier.mul(milkyPerBlock).mul(pool.allocPoint as BigNumber).mul(BigNumber.from(3600 * 24)).div(totalAllocPoint.mul(BigNumber.from(timeDuration === 0 ? 1 : timeDuration)))
    return formatDecimals(result, 18)
}

export async function getTokenPrice(token: TOKEN_TYPE) {
    if (!TOKEN_DATA[token] || TOKEN_DATA[token].chainlink === '') {
        return 0
    }

    const contractAggregator = new ethers.Contract(
        TOKEN_DATA[token].chainlink,
        AggregatorV3.abi,
        JsonProvider
    )

    const { answer } = await contractAggregator.latestRoundData()
    return formatDecimals(answer, await contractAggregator.decimals())
}

export async function getAllPairsLength() {
    const contractFactory = new ethers.Contract(
        MilkyFactory.address[getNetworkId()],
        MilkyFactory.abi,
        JsonProvider
    )

    try {
        return await contractFactory.allPairsLength()
    }
    catch {
        return 0
    }
}

export async function getTotalLiquidity() {
    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )

    let poolLength = 0

    try {
        poolLength = ((await contract.poolLength()) as BigNumber).toNumber()
    } catch { }

    let totalValue = 0.0
    for (let i = 0; i < poolLength; i++) {
        totalValue += await getCurrentPoolTVL(i)
    }

    return totalValue
}

export async function getCurrentMilkyPrice() {
    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )

    let poolLength = 0

    try {
        poolLength = ((await contract.poolLength()) as BigNumber).toNumber()
    } catch { }

    let index = -1
    for (let i = 0; i < poolLength; i++) {
        const pool = await contract.poolInfo(i)
        if (pool.lpToken === TOKEN_DATA[TOKEN_TYPE.MILKY].address) {
            continue
        }
        
        const pairData = await getPairDataFromLpAddr(pool.lpToken)
        if ((pairData.tokenA === TOKEN_TYPE.BNB && pairData.tokenB === TOKEN_TYPE.MILKY)
            || (pairData.tokenB === TOKEN_TYPE.BNB && pairData.tokenA === TOKEN_TYPE.MILKY)) {
            index = i
            break
        }
    }

    let totalAllocPoint = BigNumber.from(0)

    try {
        totalAllocPoint = await contract.totalAllocPoint() as BigNumber
    } catch { }

    if (totalAllocPoint.isZero()) {
        return 0
    }

    if (index === -1) return 0

    const pool = await contract.poolInfo(index)
    const lpAddress = pool.lpToken as string
    const contractLp = new ethers.Contract(
        lpAddress,
        MilkyPair.abi,
        JsonProvider
    )

    const data = await getPairDataFromLpAddr(lpAddress)
    const { _reserve0, _reserve1 } = await contractLp.getReserves()

    const reserve0Float = formatDecimals(_reserve0, await getDecimalToken(lpAddress))
    const reserve1Float = formatDecimals(_reserve1, await getDecimalToken(lpAddress))

    let tokenAPrice = await getTokenPrice(data.tokenA as TOKEN_TYPE)
    let tokenBPrice = await getTokenPrice(data.tokenB as TOKEN_TYPE)

    if (data.tokenA === TOKEN_TYPE.BNB || data.tokenB === TOKEN_TYPE.MILKY) {
        return tokenAPrice * reserve0Float / reserve1Float
    } else {
        return tokenBPrice * reserve1Float / reserve0Float
    }
}

export async function getCurrentBalanceToUSD(amount: number, lpAddr: string) {

    const lpContract = new ethers.Contract(
        lpAddr,
        MilkyPair.abi,
        JsonProvider
    )

    if (Milky.address[getNetworkId()] === lpAddr) return amount * await getCurrentMilkyPrice();

    const { _reserve0, _reserve1 } = await lpContract.getReserves()

    const reserve0Float = formatDecimals(_reserve0, await getDecimalToken(lpAddr))
    const reserve1Float = formatDecimals(_reserve1, await getDecimalToken(lpAddr))
    const totalSupply = formatDecimals(await lpContract.totalSupply(), await getDecimalToken(lpAddr))

    const data = await getPairDataFromLpAddr(lpAddr)

    if (data.tokenA == TOKEN_TYPE.BNB || data.tokenA == TOKEN_TYPE.BUSD) {
        let tokenAPrice = await getTokenPrice(data.tokenA as TOKEN_TYPE);
        return 2 * amount * reserve0Float * tokenAPrice / totalSupply;
    }

    if (data.tokenB == TOKEN_TYPE.BNB || data.tokenB == TOKEN_TYPE.BUSD) {
        let tokenBPrice = await getTokenPrice(data.tokenB as TOKEN_TYPE);
        return 2 * amount * reserve1Float * tokenBPrice / totalSupply
    }

    return 0;
}

export async function getCurrentPoolTVL(pid: number) {
    const contractMaster = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )
    let totalAllocPoint = BigNumber.from(0)

    try {
        totalAllocPoint = await contractMaster.totalAllocPoint() as BigNumber
    } catch { }

    if (totalAllocPoint.isZero()) {
        return 0
    }

    let pool = null

    try {
        pool = await contractMaster.poolInfo(pid)
    } catch { }

    if (pool === null) return 0

    const lpAddress = pool.lpToken as string

    if (lpAddress === TOKEN_DATA[TOKEN_TYPE.MILKY].address) {
        let amount = BigNumber.from(0)

        try {
            amount = pool.totalDeposited;
        } catch { }

        const price = (await getCurrentMilkyPrice()) * formatDecimals(amount, 18)

        return parseFloat(price.toFixed(6))
    } else {
        const contractLp = new ethers.Contract(
            lpAddress,
            MilkyPair.abi,
            JsonProvider
        )

        const data = await getPairDataFromLpAddr(lpAddress)
        const { _reserve0, _reserve1 } = await contractLp.getReserves()
        const decimals = await getDecimalToken(lpAddress);

        const reserve0Float = formatDecimals(_reserve0, decimals)
        const reserve1Float = formatDecimals(_reserve1, decimals)

        let tokenAPrice = await getTokenPrice(data.tokenA as TOKEN_TYPE)
        let tokenBPrice = await getTokenPrice(data.tokenB as TOKEN_TYPE)

        let tokenAValue = tokenAPrice * reserve0Float
        let tokenBValue = tokenBPrice * reserve1Float

        if (tokenAValue === 0) {
            tokenAValue = tokenBValue
        } else if (tokenBValue === 0) {
            tokenBValue = tokenAValue
        }

        const liquidityTvl = tokenAValue + tokenBValue

        let amount = 0;

        try {
            const totalLp = await contractLp.totalSupply()
            const poolLp = await pool.totalDeposited;

            const percentage = poolLp / totalLp;
            amount = percentage * liquidityTvl;
        } catch { }

        return parseFloat(amount.toFixed(6))
    }
}

export async function getCurrentPoolAPR(tvl: number, rewards: number) {
    if (tvl === 0 || rewards === 0) {
        return 0
    }
    const rate = await getRateFromPair(TOKEN_TYPE.MILKY, TOKEN_TYPE.BNB)
    if (rate === 0) {
        return 0
    }
    const bnbPrice = await getTokenPrice(TOKEN_TYPE.BNB)
    return parseFloat((rewards * 365 / rate * bnbPrice / tvl * 100).toFixed(2))
}

export async function searchPoolData(pattern: string): Promise<any> {
    const searchToken = TOKEN_LIST.find((value) => TOKEN_DATA[value].address === pattern)
    if (searchToken) {
        pattern = TOKEN_DATA[searchToken].value
    }

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )

    let poolLength = 0
    try {
        poolLength = ((await contract.poolLength()) as BigNumber).toNumber()
    } catch { }

    let poolDataList = []

    for (let i = 0; i < poolLength; i++) {
        const pool = await contract.poolInfo(i)
        let pairData = null
        if (pool.lpToken === TOKEN_DATA[TOKEN_TYPE.MILKY].address) {
            pairData = {
                address: pool.lpToken,
                tokenA: TOKEN_TYPE.MILKY,
                tokenB: TOKEN_TYPE.MILKY,
                allocPoint: pool.allocPoint,
                lastRewardBlock: pool.lastRewardBlock,
                pid: i,
            }
        } else {
            pairData = await getPairDataFromLpAddr(pool.lpToken)
            pairData = {
                address: pool.lpToken,
                tokenA: pairData.tokenA,
                tokenB: pairData.tokenB,
                allocPoint: pool.allocPoint,
                lastRewardBlock: pool.lastRewardBlock,
                pid: i,
            }
        }
        if (pattern.toLowerCase().indexOf(pairData.tokenA) >= 0 ||
            pattern.toLowerCase().indexOf(pairData.tokenB) >= 0) {
            poolDataList.push(pairData)
        } else if (pool.lpToken === pattern) {
            poolDataList.push(pairData)
        }
    }

    return poolDataList
}

export async function getPoolDataFromPoint(point: number): Promise<any> {
    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        JsonProvider
    )

    const poolLength = ((await contract.poolLength()) as BigNumber).toNumber()

    let poolDataList = []

    for (let i = 0; i < poolLength; i++) {
        const pool = await contract.poolInfo(i)
        if (pool.lpToken === TOKEN_DATA[TOKEN_TYPE.MILKY].address) {
            poolDataList.push({
                address: pool.lpToken,
                tokenA: TOKEN_TYPE.MILKY,
                tokenB: TOKEN_TYPE.MILKY,
                allocPoint: pool.allocPoint,
                lastRewardBlock: pool.lastRewardBlock,
                pid: i,
            })
        } else {
            const pairData = await getPairDataFromLpAddr(pool.lpToken)
            poolDataList.push({
                address: pool.lpToken,
                tokenA: pairData.tokenA,
                tokenB: pairData.tokenB,
                allocPoint: pool.allocPoint,
                lastRewardBlock: pool.lastRewardBlock,
                pid: i,
            })
        }
    }

    return poolDataList
}

export async function removeLiquidity(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE, liquidity: BigNumber, address: string, deadline: number) {
    if (!CONTRACT_TABLE[tokenA] || !CONTRACT_TABLE[tokenB]) return
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        MilkyRouter.address[getNetworkId()],
        MilkyRouter.abi,
        getSigner()
    )

    const lpAddress = await getPairAddress(tokenA, tokenB) as string
    const pairContract = new ethers.Contract(
        lpAddress,
        MilkyPair.abi,
        getSigner()
    )

    try {
        let tx;

        const decimals = await getDecimalToken(lpAddress);
        const allowance = formatDecimals(await pairContract.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), decimals)
        const amount = formatDecimals(liquidity, decimals);

        if (allowance < amount) {
            tx = await pairContract.approve(MilkyRouter.address[getNetworkId()], ethers.constants.MaxUint256)
            await tx.wait()
        }
        
        if (tokenA === TOKEN_TYPE.BNB) {
            tx = await contract.removeLiquidityETH(
                CONTRACT_TABLE[tokenB].address[getNetworkId()],
                liquidity,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline))
            )
        } else if (tokenB === TOKEN_TYPE.BNB) {
            tx = await contract.removeLiquidityETH(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                liquidity,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline))
            )
        } else {
            tx = await contract.removeLiquidity(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenB].address[getNetworkId()],
                liquidity,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline))
            )
        }

        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Remove Liquidity successfully.")
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient fund in your wallet.")
                break
            default:
                toast.error("Remove Liquidity failed.")
                break
        }
    }
}

export async function addLiquidity(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE, amountA: string, amountB: string, address: string, deadline: number) {
    if (!CONTRACT_TABLE[tokenA] || !CONTRACT_TABLE[tokenB]) return
    if (getSigner() === undefined) return;

    const contractRouter = new ethers.Contract(
        MilkyRouter.address[getNetworkId()],
        MilkyRouter.abi,
        getSigner(),
    )

    try {
        let tx;
        if (tokenA === TOKEN_TYPE.BNB) {
            const lpContract = new ethers.Contract(
                CONTRACT_TABLE[tokenB].address[getNetworkId()],
                CONTRACT_TABLE[tokenB].abi,
                getSigner()
            )
            const allowance = formatDecimals(await lpContract.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenB].address[getNetworkId()]))
            if (allowance < parseFloat(amountB)) {
                await approveToken(tokenB, ethers.constants.MaxUint256)
            }

            const amountBigNumber = str2BigNumber(amountB, await getDecimalFunc(tokenB))
            tx = await contractRouter.addLiquidityETH(
                CONTRACT_TABLE[tokenB as TOKEN_TYPE].address[getNetworkId()],
                amountBigNumber,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline)),
                {
                    value: ethers.utils.parseEther(amountA)
                }
            )
        } else if (tokenB === TOKEN_TYPE.BNB) {
            const lpContract = new ethers.Contract(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenA].abi,
                getSigner()
            )
            const allowance = formatDecimals(await lpContract.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenA].address[getNetworkId()]))

            if (allowance < parseFloat(amountA)) {
                await approveToken(tokenA, ethers.constants.MaxUint256)
            }

            const amountBigNumber = str2BigNumber(amountA, await getDecimalFunc(tokenA))
            tx = await contractRouter.addLiquidityETH(
                CONTRACT_TABLE[tokenA as TOKEN_TYPE].address[getNetworkId()],
                amountBigNumber,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline)),
                {
                    value: ethers.utils.parseEther(amountB)
                }
            )
        } else {

            const contractA = new ethers.Contract(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenA].abi,
                getSigner()
            )

            const allowanceA = formatDecimals(await contractA.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenA].address[getNetworkId()]))
            if (allowanceA < parseFloat(amountA)) {
                await approveToken(tokenA, ethers.constants.MaxUint256)
            }

            const contractB = new ethers.Contract(
                CONTRACT_TABLE[tokenB].address[getNetworkId()],
                CONTRACT_TABLE[tokenB].abi,
                getSigner()
            )

            const allowanceB = formatDecimals(await contractB.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenB].address[getNetworkId()]))
            if (allowanceB < parseFloat(amountB)) {
                await approveToken(tokenB, ethers.constants.MaxUint256)
            }

            const amountABigNumber = str2BigNumber(amountA, await getDecimalFunc(tokenA))
            const amountBBigNumber = str2BigNumber(amountB, await getDecimalFunc(tokenB))
            tx = await contractRouter.addLiquidity(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenB].address[getNetworkId()],
                amountABigNumber,
                amountBBigNumber,
                0,
                0,
                address,
                BigNumber.from(await getDeadlineTime(deadline))
            )
        }

        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Liquidity added successfully.")
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient funds in your wallet.")
                break
            default:
                toast.error("Adding liquidity failed.")
                break
        }
    }
}

export async function getMilkyPair(): Promise<void> {
    const contract = new ethers.Contract(
        MilkyFactory.address[getNetworkId()],
        MilkyFactory.abi,
        JsonProvider
    )
}

export async function getTokenBalance(value: TOKEN_TYPE, address: string): Promise<number> {
    if (!CONTRACT_TABLE[value] || !CONTRACT_TABLE[value]) return 0

    const contract = new ethers.Contract(
        CONTRACT_TABLE[value].address[getNetworkId()],
        CONTRACT_TABLE[value].abi,
        JsonProvider,
    )

    return formatDecimals(await contract.balanceOf(address), await getDecimalFunc(value))
}

export async function getStakedBalance(pid: number): Promise<any> {
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        getSigner()
    )

    const value = await contract.userInfo(pid, getAddress())

    return {
        realBalance: value[0],
        balance: formatDecimals(value[0], 18)
    }
}

export async function getPendingMilky(pid: number, lpAddr: string) {
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        getSigner()
    )

    const pendingMilky = await contract.pendingMilky(pid, getAddress())

    return {
        rewards: formatDecimals(pendingMilky[0], await getDecimalToken(lpAddr)),
        instant: formatDecimals(pendingMilky[1], await getDecimalToken(lpAddr)),
        locked: formatDecimals(pendingMilky[2], await getDecimalToken(lpAddr)),
        unlocked: formatDecimals(pendingMilky[3], await getDecimalToken(lpAddr)),
    }
}

export async function getRewardMilkyTokens(pid: number, address: string, amount: string | BigNumber) {
    if (getSigner() === undefined) return;

    await approve(address, MasterChef.address[getNetworkId()], amount, await getDecimalToken(address))

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        getSigner()
    )

    const amountBigNumber = amount instanceof BigNumber ? amount : str2BigNumber(amount, await getDecimalToken(address))

    try {
        let tx = await contract.deposit(pid, amountBigNumber)

        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Rewards successfully claimed.")

        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient funds in your wallet.")
                break
            default:
                toast.error("Claiming rewards failed.")
                break
        }
    }
}

export async function unstakeTokensFromPool(pid: number, address: string, amount: string | BigNumber) {
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        getSigner()
    )

    const amountBigNumber = amount instanceof BigNumber ? amount : str2BigNumber(amount, await getDecimalToken(address))

    if (amountBigNumber.isZero()) {
        const user = await contract.userInfo(pid, getAddress())
        const claimCooldown = await contract.CLAIM_COOLDOWN()

        const nextClaim = Math.floor(Number(user[3]) + Number(claimCooldown)) * 1000;

        if (nextClaim > Date.now()) {
            toast.error("You can claim rewards only once every 24 hours!")
            return
        }
    }

    try {
        let tx = await contract.withdraw(pid, amountBigNumber)

        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            if (amountBigNumber.isZero()) {
                toast.success("Successfully harvested rewards!")
            } else {
                toast.success("Successfully unstake LP tokens!")
            }
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            default:
                toast.error("Failed unstake LP tokens.")
                break
        }
    }
}

export async function stakeTokensToPool(pid: number, amount: string, lpAddress: string, balance: number) {
    if (getSigner() === undefined) return;

    const lpContract = new ethers.Contract(
        lpAddress,
        IERC20.abi,
        getSigner()
    )

    const allowance = formatDecimals(await lpContract.allowance(getAddress(), MasterChef.address[getNetworkId()]), await getDecimalToken(lpAddress))
    if (allowance < parseFloat(amount)) {
        await approveLP(lpAddress, ethers.constants.MaxUint256)
    }

    const contract = new ethers.Contract(
        MasterChef.address[getNetworkId()],
        MasterChef.abi,
        getSigner()
    )

    const amountBigNumber = str2BigNumber(amount, await getDecimalToken(lpAddress))

    try {
        let tx = await contract.deposit(pid, amountBigNumber)

        let receipt: ContractReceipt = await tx.wait()

        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Tokens successfully staked.")
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient funds in your wallet.")
                break
            default:
                toast.error("Staking tokens failed.")
                break
        }
    }
}

export async function getLPBalance(token: string): Promise<any> {
    if (getSigner() === undefined) return;

    const contract = new ethers.Contract(
        token,
        token === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? Milky.abi : MilkyPair.abi,
        getSigner()
    )

    if (await getAddress() === '') {
        return {
            realBalance: BigNumber.from(0),
            balance: 0
        }
    }

    const balance = await contract.balanceOf(getAddress())
    return {
        realBalance: balance,
        balance: formatDecimals(balance, 18)
    }
}

export async function getPoolBalance(token: string): Promise<any> {
    const contract = new ethers.Contract(
        token,
        token === TOKEN_DATA[TOKEN_TYPE.MILKY].address ? Milky.abi : MilkyPair.abi,
        JsonProvider
    )

    const balance = await contract.balanceOf(MasterChef.address[getNetworkId()])
    return {
        realBalance: balance,
        balance: formatDecimals(balance, 18)
    }
}

export async function swapTokensToEth(tokenA: TOKEN_TYPE, tokenB: TOKEN_TYPE, amountIn: string, amountOutMin: string, address: string, slippage: number, deadline: number, route: string[]) {
    if (!CONTRACT_TABLE[tokenA] || !CONTRACT_TABLE[tokenB]) return 0
    if (getSigner() === undefined) return;

    const contractRouter = new ethers.Contract(
        MilkyRouter.address[getNetworkId()],
        MilkyRouter.abi,
        getSigner(),
    )

    const decimalsA = await getDecimalFunc(tokenA)

    const minimum = (parseFloat(amountOutMin) * (100 - slippage) / 100).toString()

    if (route.length === 0) return

    const path: string[] = []

    for (let i = 0; i < route.length; i++) {
        const token = route[i] as TOKEN_TYPE
        if (!CONTRACT_TABLE[token]) return
        path.push(CONTRACT_TABLE[token].address[getNetworkId()])
    }

    try {
        let tx = null
        if (tokenA === TOKEN_TYPE.BNB) {
            tx = await contractRouter.swapExactETHForTokens(
                str2BigNumber(minimum, decimalsA),
                path,
                address,
                BigNumber.from(await getDeadlineTime(deadline)),
                { value: ethers.utils.parseEther(amountIn) }
            )
        } else if (tokenB === TOKEN_TYPE.BNB) {
            const lpContract = new ethers.Contract(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenA].abi,
                getSigner()
            )
            const allowance = formatDecimals(await lpContract.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenA].address[getNetworkId()]))

            if (allowance < parseFloat(amountIn)) {
                await approveToken(tokenA, ethers.constants.MaxUint256)
            }

            tx = await contractRouter.swapExactTokensForETH(
                str2BigNumber(amountIn, decimalsA),
                str2BigNumber(minimum, decimalsA),
                path,
                address,
                BigNumber.from(await getDeadlineTime(deadline)),
            )
        } else {
            const lpContract = new ethers.Contract(
                CONTRACT_TABLE[tokenA].address[getNetworkId()],
                CONTRACT_TABLE[tokenA].abi,
                getSigner()
            )

            const allowance = formatDecimals(await lpContract.allowance(getAddress(), MilkyRouter.address[getNetworkId()]), await getDecimalToken(CONTRACT_TABLE[tokenA].address[getNetworkId()]))
            if (allowance < parseFloat(amountIn)) {
                await approveToken(tokenA, ethers.constants.MaxUint256)
            }

            tx = await contractRouter.swapExactTokensForTokens(
                str2BigNumber(amountIn, decimalsA),
                str2BigNumber(minimum, decimalsA),
                path,
                address,
                BigNumber.from(await getDeadlineTime(deadline)),
            )
        }

        let receipt: ContractReceipt = await tx.wait()
        const events = receipt.events
        if (events && events.length > 0) {
            toast.success("Swapped successfully.")
        }
    } catch (error: any) {
        switch (error.code) {
            case 4001:
                break
            case "INSUFFICIENT_FUNDS":
                toast.error("Insufficient fund in your wallet.")
                break
            default:
                toast.error("Swap failed.")
                break
        }
    }
}

export function formatDecimals(number: BigNumber | string, decimals: number, rounded: number = 6): number {
    let strNumber = BigNumber.from(number === '' ? 0 : number).toString()
    if (strNumber.length <= decimals) {
        strNumber = '0'.repeat(decimals + 1 - strNumber.length) + strNumber
    }
    const dp = strNumber.length - decimals
    const result = parseFloat(strNumber.substring(0, dp) + '.' + strNumber.substring(dp, dp + rounded))
    return !isNaN(result) ? result : 0
}
