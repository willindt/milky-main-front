import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Stack, Input } from '@mui/material';
import { useEffect } from 'react';
import { getLPBalance, stakeTokensToPool, getPoolBalance, unstakeTokensFromPool, getCurrentBalanceToUSD, getStakedBalance } from 'utils/integrate'
import { useOnboard } from 'use-onboard'
import { TypeDialog } from 'config/constants/types'
import { BigNumber } from 'ethers';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        minWidth: '400px',
        backgroundColor:'#2b0e79',
        color:'white',
    },
    '& .MuiDialogContent-root': {
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& #customized-dialog-title': {
        color:'white',
    }
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, px: 4, color: '#2b0e79', fontWeight: '900' }} {...other} >
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

const InputStyle = styled(Input)(({ theme }) => ({
    color: '#2b0e79',
    '&::after, &::before': {
        display: 'none'
    },

    [theme.breakpoints.down('sm')]: {
        width: 'auto',
        marginLeft: '10px',
        padding: '15px 5px',
    }
}));

interface stakeProps {
    open: boolean,
    lpAddr: string,
    pid: number,
    type: string,
    pairType: string,
    handleOpen: (arg: boolean) => void
}

export default function CustomizedDialogs({ open, lpAddr, pid, type, pairType, handleOpen }: stakeProps) {
    const [opendlg, setOpenDlg] = React.useState(false)
    const [amount, setAmount] = React.useState('0')
    const [realBalance, setRealBalance] = React.useState(BigNumber.from(0))
    const [balance, setBalance] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [balanceUSD, setBalanceUSD] = React.useState(0.0)

    async function handleLpBalance(lpAddr: string) {
        const lpBalance = await getLPBalance(lpAddr)
        if (lpBalance !== undefined) {
            const usd = await getCurrentBalanceToUSD(lpBalance.balance as number, lpAddr)
            setBalanceUSD(usd)
            setRealBalance(lpBalance.realBalance)
            setBalance(lpBalance.balance)
        }
    }

    async function handlePoolBalance(lpAddr: string) {
        const lpBalance = await getPoolBalance(lpAddr)
        const usd = await getCurrentBalanceToUSD(lpBalance.balance as number, lpAddr)
        setBalanceUSD(usd)
        setRealBalance(lpBalance.realBalance)
        setBalance(lpBalance.balance)
    }

    async function handleStakedBalance() {
        const lpBalance = await getStakedBalance(pid)
        if (lpBalance !== undefined) {
            const usd = await getCurrentBalanceToUSD(lpBalance.balance as number, lpAddr)
            setBalanceUSD(usd)
            setRealBalance(lpBalance.realBalance)
            setBalance(lpBalance.balance)
        }
    }

    useEffect(() => {
        setOpenDlg(open);
        if (open) {
            if (type === TypeDialog.STAKE) {
                handleLpBalance(lpAddr)
            } else if (type === TypeDialog.UNSTAKE) {
                handleStakedBalance()
                // handlePoolBalance(lpAddr)
            }
        }
    }, [open])

    const handleClose = () => {
        setOpenDlg(false);
        handleOpen(false);
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value)
    };

    const handleClickConfirm = async () => {
        setLoading(true)
        if (type === TypeDialog.STAKE) {
            await stakeTokensToPool(pid, amount, lpAddr, balance)
        } else {
            await unstakeTokensFromPool(pid, lpAddr, amount == balance.toString() ? realBalance : amount)
        }
        setLoading(false)
    }

    const handleMaxClicked = () => {
        setAmount(balance.toString())
    }

    useEffect(() => {
        if (loading) return;
        setAmount('0.0')
        if (type === TypeDialog.STAKE) {
            handleLpBalance(lpAddr)
        } else if (type === TypeDialog.UNSTAKE) {
            handleStakedBalance()
            // handlePoolBalance(lpAddr)
        }
    }, [loading])

    return (
        <div>
            {
                opendlg && (
                    <BootstrapDialog
                        sx={{
                            minWidth: '300px'
                        }}
                        onClose={handleClose}
                        aria-labelledby="customized-dialog-title"
                        open={opendlg}
                    >
                        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            {type}
                        </BootstrapDialogTitle>
                        <DialogContent>
                            <Stack padding={2} sx={{ borderRadius: '10px', backgroundColor: '#eeeaf4', color: '#2b0e79' }} >
                                <Stack direction="row" alignItems='center' justifyContent='space-between'>
                                    <Typography fontWeight='bolder'>{type}</Typography>
                                    {
                                        type === 'UnStake' ? (
                                            <Typography fontWeight='bolder'>Balance: {balance.toFixed(2)} (${balanceUSD.toFixed(2)})</Typography>
                                        ) : (
                                            <Typography fontWeight='bolder'>Balance: {balance.toFixed(2)} (${balanceUSD.toFixed(2)})</Typography>
                                        )
                                    }
                                </Stack>
                                <Stack direction="row" alignItems='center' justifyContent='space-between'>
                                    <InputStyle type='text' value={amount} onChange={handleValueChange}></InputStyle>
                                    <Stack direction="row" alignItems='end'>
                                        <Button variant="contained" sx={{ marginRight: '8px' }} onClick={() => handleMaxClicked()}>MAX</Button>
                                        <Typography fontWeight='bolder'>{pairType}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ marginRight: '16px', marginBottom: '10px' }}>
                            <Button variant="outlined" onClick={handleClose} disabled={loading ? true : false}>Cancel</Button>
                            <Button variant="contained" onClick={handleClickConfirm} disabled={loading ? true : false}>Confirm</Button>
                        </DialogActions>
                    </BootstrapDialog>
                )
            }
        </div>
    );
}