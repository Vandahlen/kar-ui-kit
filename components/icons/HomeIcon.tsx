/**
 * components/icons/HomeIcon.tsx
 *
 * Bottom-tab "hem" icon: a solid arch with a door notch.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 23.3 x 26.7dp rendered, solid fill, no stroke.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const HomeIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M3 23V11a9 9 0 0 1 18 0v12h-6.6v-3.6a2.4 2.4 0 0 0-4.8 0V23H3Z"
      fill={color}
    />
  </Svg>
);

export default HomeIcon;
