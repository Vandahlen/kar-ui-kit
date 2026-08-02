/**
 * components/icons/FilterIcon.tsx
 *
 * Sliders/filter icon, matching the Kårappen graphic profile's
 * "Filter" icon concept (hand-authored - see SearchIcon.tsx).
 */
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

export interface FilterIconProps {
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

const FilterIcon: React.FC<FilterIconProps> = ({ size = 20, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="8" cy="6" r="2.2" fill={color} />
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="16" cy="12" r="2.2" fill={color} />
    <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Circle cx="11" cy="18" r="2.2" fill={color} />
  </Svg>
);

export default FilterIcon;
