/**
 * components/icons/FoodIcon.tsx
 *
 * Bottom-tab "mat" icon: fork and knife, solid.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 18.3 x 21.3dp rendered, solid fill.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const FoodIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M4.6 2.2a.9.9 0 0 1 .9.9v5h.9v-5a.9.9 0 0 1 1.8 0v5h.9v-5a.9.9 0 0 1 1.8 0V9a3.6 3.6 0 0 1-2.6 3.5v8.4a1 1 0 0 1-2 0v-8.4A3.6 3.6 0 0 1 3.7 9V3.1a.9.9 0 0 1 .9-.9Z"
      fill={color}
    />
    <Path
      d="M17.3 2.2c1.5 0 2.5 3.6 2.5 6.5 0 2.2-.7 3.6-1.7 4.1v8.1a1 1 0 0 1-2 0v-8.1c-1-.5-1.7-1.9-1.7-4.1 0-2.9 1-6.5 2.5-6.5Z"
      fill={color}
    />
  </Svg>
);

export default FoodIcon;
