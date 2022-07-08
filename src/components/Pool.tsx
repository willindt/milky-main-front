import { Box, Slider, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { TOKEN_TYPE, TOKEN_DATA } from 'utils/integrate';

interface PoolProps {
    lpPair: any,
    lpBalance: string,
    lpTotalSupply: string,
    reserveA: number,
    reserveB: number,
    rate: number,
    updatePro: (arg: number) => void
}

function valuetext(value: number) {
    return `${value}%`;
}

const ToggleButtonStyle = styled(ToggleButton)(() => ({
    padding: '10px 0px',
    color: '#FFFFFF',
    borderRadius: '14px !important',
    backgroundColor: '#1F0F4A',
    border: 'none',
    textTransform: 'capitalize',
    '&.Mui-selected': {
        color: '#FFFFFF',
        backgroundColor: '#DD38F2',
    },
    '& + &': {
        marginLeft: '10px !important',
    },
}));

const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

const Pool = ({ lpPair, lpBalance, lpTotalSupply, reserveA, reserveB, rate, updatePro }: PoolProps) => {
    const [value, setValue] = useState<number>(25);
    const [tokenOrder, setTokenOrder] = useState<string[]>(['key0', 'key1']);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number);
    }

    useEffect(() => {
        updatePro(value > 0 ? (100 / value) : 0)
    }, [value])

    useEffect(() => {
        if (lpPair !== null && lpPair !== '') {
            const address0 = parseInt(TOKEN_DATA[lpPair.key0.value as TOKEN_TYPE].address, 16);
            const address1 = parseInt(TOKEN_DATA[lpPair.key1.value as TOKEN_TYPE].address, 16);

            setTokenOrder(address0 > address1 ? ['key0', 'key1'] : ['key1', 'key0']);
        }
    }, [lpPair])

    return (
        <Box sx={{
            borderRadius: '19px',
            padding: '25px 45px',
            backgroundColor: '#1F0F4A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Box sx={{
                display: 'flex',
                paddingBottom: '25px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {
                        lpPair && (
                            <>
                                <img
                                    loading="lazy"
                                    width="40"
                                    src={lpPair[tokenOrder[0]].image}
                                    alt={`Flag of ${lpPair[tokenOrder[0]].label}`}
                                    style={{ display: 'inline-flex', paddingRight: '8px' }}
                                ></img>
                                <span style={{ color: '#fff' }}>Pooled {lpPair[tokenOrder[0]].label}</span>
                            </>
                        )
                    }
                </Box>
                <div style={{ color: '#fff' }}>
                    {
                        parseFloat(lpBalance) >= 0 && parseFloat(lpTotalSupply) > 0 && reserveA >= 0 ? `${parseFloat((parseFloat(lpBalance) / parseFloat(lpTotalSupply) * reserveA).toFixed(6))} (${parseFloat((parseFloat(lpBalance) / parseFloat(lpTotalSupply) * reserveA * value / 100.0).toFixed(6))})` : 0
                    }
                </div>
            </Box>
            <Box sx={{
                display: 'flex',
                paddingBottom: '50px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    {
                        lpPair && (
                            <>
                                <img
                                    loading="lazy"
                                    width="40"
                                    src={lpPair[tokenOrder[1]].image}
                                    alt={`Flag of ${lpPair[tokenOrder[1]].label}`}
                                    style={{ display: 'inline-flex', paddingRight: '8px' }}
                                ></img>
                                <span style={{ color: '#fff' }}>Pooled {lpPair[tokenOrder[1]].label}</span>
                            </>
                        )
                    }
                </Box>
                <div style={{ color: '#fff' }}>
                    {
                        parseFloat(lpBalance) >= 0 && parseFloat(lpTotalSupply) > 0 && reserveB >= 0 ? `${parseFloat((parseFloat(lpBalance) / parseFloat(lpTotalSupply) * reserveB).toFixed(6))} (${parseFloat((parseFloat(lpBalance) / parseFloat(lpTotalSupply) * reserveB * value / 100.0).toFixed(6))})` : 0
                    }
                </div>
            </Box>
            <PrettoSlider
                aria-label="Always visible"
                defaultValue={25}
                value={value}
                onChange={handleChange}
                getAriaValueText={valuetext}
                step={25}
                valueLabelDisplay="on"
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
            }}>
                <ToggleButtonStyle value="0" aria-label="left aligned" onClick={() => setValue(0)}>
                    0%
                </ToggleButtonStyle>
                <ToggleButtonStyle value="25" aria-label="left aligned" onClick={() => setValue(25)}>
                    25%
                </ToggleButtonStyle>
                <ToggleButtonStyle value="50" aria-label="centered" onClick={() => setValue(50)}>
                    50%
                </ToggleButtonStyle>
                <ToggleButtonStyle value="75" aria-label="right aligned" onClick={() => setValue(75)}>
                    75%
                </ToggleButtonStyle>
                <ToggleButtonStyle value="100" aria-label="right aligned" onClick={() => setValue(100)}>
                    100%
                </ToggleButtonStyle>
            </Box>
        </Box>
    )
}

export default Pool;