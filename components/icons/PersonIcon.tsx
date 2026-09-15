/**
 * components/icons/PersonIcon.tsx
 *
 * Header profile icon: solid head and shoulders.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: solid fill, head and body separated by a visible gap.
 */
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

const PersonIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Circle cx="12" cy="7.6" r="3.9" fill={color} />
    <Path
      d="M12 13.2c-4.1 0-7.4 2.7-7.4 6 0 .7.6 1.3 1.3 1.3h12.2c.7 0 1.3-.6 1.3-1.3 0-3.3-3.3-6-7.4-6Z"
      fill={color}
    />
  </Svg>
);

export default PersonIcon;
