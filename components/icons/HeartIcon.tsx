/**
 * components/icons/HeartIcon.tsx
 *
 * Favourite icon: outlined heart. Takes the section accent.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 21.3 x 19.3dp rendered, 2dp stroke, no fill.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const HeartIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M12 20.8C10.3 19.6 3.6 15 3.6 10.2A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8.4 2.6c0 4.8-6.7 9.4-8.4 10.6Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

export default HeartIcon;
