import * as React from 'react';
import SelectUnstyled, {
    SelectUnstyledProps,
    selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import { styled } from '@mui/system';
import { PopperUnstyled } from '@mui/base';

import { TOKEN_PAIR, getPairData } from "utils/integrate"

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

const StyledButton = styled('button')(
    ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  min-width: 180px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#1D062C'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : '#1D062C'};
  border-radius: 14px;
  padding: 5px 15px;
  text-align: left;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : '#FFFFFF'};
  display: flex;
  align-items: center;
  position: relative;
  
  &.unselected {
    background: #DD38F2;
  }

  &:hover {
    background: ${theme.palette.mode === 'dark' ? '' : '#1D062C'};
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : '#1D062C'};
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
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
  `,
);

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
  border-radius: 0.75em;
  color: white;
  overflow: auto;
  outline: 0px;
  z-index: 9;
  `,
);

const StyledOption = styled(OptionUnstyled)(
    ({ theme }) => `
  list-style: none;
  padding: 8px;
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
    lp: string | null,
    pairs: any[],
    connected: boolean,
    updateLP: (arg: string | null) => void
}

export default function UnstyledSelectRichOptions({ lp, pairs, connected, updateLP  }: SelectOptionsProps) {
    const handleChange = (val: string | null) => {
        updateLP(val)
    };

    return (
        <div style={{marginBottom: '16px'}}>
            <CustomSelect
                value={lp}
                onChange={handleChange}
                disabled={connected ? false : true}
            >
                <StyledOption key="default" value="default">
                    Add Liquidity
                </StyledOption>
                {pairs.map((pair) => (
                    <StyledOption key={pair.value} value={pair.value}>
                        <img
                            loading="lazy"
                            width="25"
                            src={pair.key0.image}
                            alt={`Flag of ${pair.key0.label}`}
                            style={{ display: 'inline-flex', paddingRight: '4px' }}
                        />
                        <img
                            loading="lazy"
                            width="25"
                            src={pair.key1.image}
                            alt={`Flag of ${pair.key1.label}`}
                            style={{ display: 'inline-flex', paddingRight: '4px' }}
                        />
                        <span>{pair.label}</span>
                    </StyledOption>
                ))}
            </CustomSelect>
        </div>
    );
}