import { useState, useEffect } from 'react';
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
import { TypeDialog } from 'config/constants/types'
import { borderRadius } from '@mui/system';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        minWidth: '400px'
    },
    '& .MuiDialogContent-root': {
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, px: 3, color: '#2b0e79', fontWeight: '900' }} {...other} >
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
    fontWeight: 900,
    width: '60px',
    fontSize: '14px',
    borderRadius: '20px',
    paddingRight: '16px',
    paddingLeft: '16px',
    border: '1px solid #2b0e79',
    '&::after, &::before': {
        display: 'none'
    },
}));

const SlippageButton = styled('div')(() => ({
    borderRadius: '20px',
    paddingRight: '16px',
    paddingLeft: '16px',
    paddingTop: '4px',
    paddingBottom: '4px',
    marginRight: '8px',
    backgroundColor: '#2B0E79',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 900
}));

interface stakeProps {
    open: boolean,
    slippage: number,
    deadline: number,
    handleOpen: (arg: boolean) => void,
    handleSlippage: (arg: number) => void,
    handleDeadline: (arg: number) => void
}

export default function CustomizedDialogs({ open, slippage, deadline, handleOpen, handleSlippage, handleDeadline }: stakeProps) {
    const [opendlg, setOpenDlg] = useState(open)
    const [strSlippage, setSlippage] = useState(slippage.toString())
    const [strDeadline, setDeadline] = useState(deadline.toString())

    const handleClose = () => {
        setOpenDlg(false);
        handleOpen(false);
    };

    const changeSlippage = (value: string) => {
        setSlippage(value)
        handleSlippage(parseFloat(value))
    }

    const changeDeadline = (value: string) => {
        setDeadline(value)
        handleDeadline(parseFloat(value))
    }

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
                            Settings
                        </BootstrapDialogTitle>
                        <DialogContent>
                            <Stack direction="column">
                                <Typography>Slippage Tolerance</Typography>
                                <Stack marginY={1} direction="row" alignItems="center">
                                    <SlippageButton onClick={() => changeSlippage('1.0')} sx={{
                                        backgroundColor: strSlippage === '1.0' ? '#2B0E79' : '#DBEAFF',
                                        color: strSlippage === '1.0' ? '#FFFFFF' : '#2B0E79'
                                    }}>
                                        1.0
                                    </SlippageButton>
                                    <SlippageButton onClick={() => changeSlippage('3.0')} sx={{
                                        backgroundColor: strSlippage === '3.0' ? '#2B0E79' : '#DBEAFF',
                                        color: strSlippage === '3.0' ? '#FFFFFF' : '#2B0E79'
                                    }}>
                                        3.0
                                    </SlippageButton>
                                    <SlippageButton onClick={() => changeSlippage('5.0')} sx={{
                                        backgroundColor: strSlippage === '5.0' ? '#2B0E79' : '#DBEAFF',
                                        color: strSlippage === '5.0' ? '#FFFFFF' : '#2B0E79'
                                    }}>
                                        5.0
                                    </SlippageButton>
                                    <InputStyle value={strSlippage} onChange={(e) => changeSlippage(e.target.value) }></InputStyle>
                                    <Typography sx={{ paddingLeft: '4px', fontWeight: 900, color: '#2B0E79' }}>%</Typography>
                                </Stack>
                                <Stack width='100%' marginY={1} direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography>Tx deadline (mins)</Typography>
                                    <InputStyle value={strDeadline} onChange={(e) => changeDeadline(e.target.value) }></InputStyle>
                                </Stack>
                            </Stack>
                        </DialogContent>
                    </BootstrapDialog>
                )
            }
        </div>
    );
}