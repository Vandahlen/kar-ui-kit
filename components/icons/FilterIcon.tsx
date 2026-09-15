/**
 * components/icons/FilterIcon.tsx
 *
 * Filter icon: three centred bars of decreasing length.
 *
 * CORRECTED against the shipping app. This was previously a "sliders" icon
 * (full-width lines with knobs) taken from the graphic profile; the app draws
 * three centred bars with no knobs. Measured: 18.7 x 12.0dp, 2dp bars, bar
 * lengths 18.7 / 14.3 / 10.0dp, centres 5.33dp apart.
 */
import React from 'react';
import Svg, { Line } from 'react-native-svg';
import { IconProps } from './types';

const FilterIcon: React.FC<IconProps> = ({ size = 20, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="1.2" y1="5.6" x2="22.8" y2="5.6" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    <Line x1="3.7" y1="12" x2="20.3" y2="12" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    <Line x1="6.2" y1="18.4" x2="17.8" y2="18.4" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  </Svg>
);

export default FilterIcon;
