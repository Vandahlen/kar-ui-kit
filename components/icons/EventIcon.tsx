/**
 * components/icons/EventIcon.tsx
 *
 * Bottom-tab "event" icon: calendar with a star cut out.
 *
 * HAND-TRACED from 3x screenshots of the shipping Karappen (v2.2.0-csu) - the
 * app's icons are react-native-svg primitives compiled into Hermes bytecode and
 * are NOT recoverable as path data from the APK. Shape is drawn by eye; the
 * DIMENSIONS below are measured: 20.7 x 20.3dp rendered, solid fill, star punched via evenodd.
 */
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

const EventIcon: React.FC<IconProps> = ({ size = 24, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 3h11A3.5 3.5 0 0 1 21 6.5V7H3v-.5A3.5 3.5 0 0 1 6.5 3Zm-3.5 5.6h18v9.9A3.5 3.5 0 0 1 17.5 22h-11A3.5 3.5 0 0 1 3 18.5V8.6Zm9 2.4 1.55 3.14 3.45.5-2.5 2.44.59 3.45L12 18.9l-3.09 1.63.59-3.45-2.5-2.44 3.45-.5L12 11Z"
      fill={color}
    />
  </Svg>
);

export default EventIcon;
