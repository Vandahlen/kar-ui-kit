/**
 * components/icons/ArrowRightIcon.tsx
 *
 * Trailing "go" arrow on list rows.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 2dp stroke, round caps and joins.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const ArrowRightIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M4 12h15m0 0-5.6-5.6M19 12l-5.6 5.6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowRightIcon;
