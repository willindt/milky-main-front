import * as React from 'react';
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import { fontFamily, styled } from '@mui/system';
import { PopperUnstyled } from '@mui/base';
import { Box } from '@mui/material';

import milkyLogo from "assets/images/milky.png";
import wsgLogo from "assets/images/wsg.png";
import busdLogo from "assets/images/busd.png";
import bnbLogo from "assets/images/bnb.png";
import usdtLogo from "assets/images/usdt.png";

import { TOKEN_TYPE } from "utils/integrate"

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027',
};

// fontFamily: 'IBM Plex Sans, sans-serif',
  // fontSize: '0.875rem',
  // minHeight: 'calc(1.5em + 22px)',
  // marginTop: '10px',
  // background: `${theme.palette.mode === 'dark' ? grey[900] : '#1D062C'}`,
  // border: `1px solid ${theme.palette.mode === 'dark' ? grey[800] : '#1D062C'}`,
  // borderRadius: '14px',
  // padding: '5px 15px',
  // textAlign: 'left',
  // lineHeight: '1.5',
  // color: `${theme.palette.mode === 'dark' ? grey[300] : '#FFFFFF'}`,
  // display: 'flex',
  // alignItems: 'center',
  // position: 'relative',
  // '&.unselected': {
  //   background: '#DD38F2',
  // },
  // '&:hover': {
  //   background: `${theme.palette.mode === 'dark' ? '' : '#1D062C'}`,
  //   borderColor: `${theme.palette.mode === 'dark' ? grey[700] : '#1D062C'}`
  // },
  // [theme.breakpoints.down('sm')]: {
  //   width: '100%',
  // },
  // [theme.breakpoints.up('sm')]: {
  //   width: '300px',
  //   marginRight: '40px',
  // },
  // '&::after': {
	// 	display: 'none',
  //   position: 'absolute',
  //   right: '15px'
	// },
  // '&.${ selectUnstyledClasses.expanded }': {
  //   '&::after': {
  //     content: '▴',
  //   }
  // },
  // '&::after': {
  //     content: '▾',
  //     float: 'right',
  //     position: 'absolute',
  //     right: '15px',
  //   }
  // },
const StyledButton = styled('button')(({ theme }) => `
    font-family: 'IBM Plex Sans, sans - serif',
    font-size: 0.875rem;
    box-sizing: border - box;
    min-height: calc(1.5em + 22px);
    width: ${ theme.breakpoints.down('sm') ? '100% !important' : '190px !important' };
    margin-top: 10px;
    background: ${ theme.palette.mode === 'dark' ? grey[900] : '#1D062C' };
    border: 1px solid ${ theme.palette.mode === 'dark' ? grey[800] : '#1D062C' };
    border-radius: 14px;
    padding: 5px 15px;
    text-align: left;
    line-height: 1.5;
    color: ${ theme.palette.mode === 'dark' ? grey[300] : '#FFFFFF' };
    display: flex;
    align-items: center;
    position: relative;

  &.unselected {
      background: #DD38F2;
    }

  &:hover {
      background: ${ theme.palette.mode === 'dark' ? '' : '#1D062C' };
      border - color: ${ theme.palette.mode === 'dark' ? grey[700] : '#1D062C' };
    }

  &.${ selectUnstyledClasses.focusVisible } {
      outline: 3px solid ${ theme.palette.mode === 'dark' ? blue[600] : blue[100] };
    }

  &.${ selectUnstyledClasses.expanded } {
    &::after {
        content: '▴';
      }
    }

  &::after {
      content: '▾';
      float: right;
      position: absolute;
      right: 15px;
    }
  },
`);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 10px;
  min-width: 170px;
  max-height: 400px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#1D062C'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : '#1D062C'};
  border-radius: 0.75em;
  color: ${theme.palette.mode === 'dark' ? grey[300] : '#fff'};
  overflow: auto;
  outline: 0px;
  z-index: 9;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 4px 8px;
  border-radius: 0.45em;
  cursor: default;
  display: flex;
  align-items: center;
  margin: 0 0 3px;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 2;
`;

const CustomSelect = React.forwardRef(function CustomSelect(
  props: SelectUnstyledProps<string>,
  ref: React.ForwardedRef<any>,
) {
  const components: SelectUnstyledProps<string>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

interface SelectOptionsProps {
  currency: string | null,
  updateCurrency: (arg: string | null) => void
}

export default function UnstyledSelectRichOptions({ currency, updateCurrency }: SelectOptionsProps) {
  const handleChange = (val: string | null) => {
    updateCurrency(val)
  };

  return (
    <CustomSelect
      value={currency}
      className={!currency ? 'unselected' : ''}
      onChange={handleChange}
    >
      <StyledOption key="default" value="default">
        Select a token
      </StyledOption>
      {cryptos.map((c) => (
        <StyledOption key={c.value} value={c.value}>
          <Box sx={{
            borderRadius: '50%',
            padding: '5px',
            width: '31px',
            height: '31px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '10px',
          }}>
            <img
              loading="lazy"
              width="25"
              src={c.image}
              alt={`Flag of ${c.label}`}
              style={{ display: 'inline-flex' }}
            />
          </Box>
          <span>{c.label}</span>
        </StyledOption>
      ))}
    </CustomSelect>
  );
}

const cryptos = [
  { value: TOKEN_TYPE.BNB, label: 'BNB', image: bnbLogo },
  { value: TOKEN_TYPE.MILKY, label: 'MILKY', image: milkyLogo },
  { value: TOKEN_TYPE.BUSD, label: 'BUSD', image: busdLogo },
  { value: TOKEN_TYPE.WSG, label: 'WSG', image: wsgLogo },
  { value: TOKEN_TYPE.USDT, label: 'USDT', image: usdtLogo },
]
