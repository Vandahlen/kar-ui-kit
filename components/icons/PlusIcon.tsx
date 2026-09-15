/**
 * components/icons/PlusIcon.tsx
 *
 * Bottom-tab "extra" icon: thick plus with rounded corners.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 24.0dp wide rendered, solid fill.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const PlusIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      d="M10.3 2.6h3.4a1.7 1.7 0 0 1 1.7 1.7v4.6h4.6a1.7 1.7 0 0 1 1.7 1.7v3.4a1.7 1.7 0 0 1-1.7 1.7h-4.6v4.6a1.7 1.7 0 0 1-1.7 1.7h-3.4a1.7 1.7 0 0 1-1.7-1.7v-4.6H4a1.7 1.7 0 0 1-1.7-1.7v-3.4A1.7 1.7 0 0 1 4 8.9h4.6V4.3a1.7 1.7 0 0 1 1.7-1.7Z"
      fill={color}
    />
  </Svg>
);

export default PlusIcon;
