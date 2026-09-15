/**
 * components/ChalmersBackground.tsx
 *
 * The decorative shape layer Karappen draws behind every screen, with the
 * screen's own content composited on top.
 *
 * Wrap a screen root in this. Without it, the translucent surfaces
 * (`surfaces.card` at 80%, `surfaces.listCard` at 50%) have nothing to
 * reveal and read as flat grey - the design depends on this layer.
 *
 * The shapes are brand tokens at two measured opacity tiers over
 * `decorative.base`. See theme/backgroundShapes.ts for provenance.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors, decorative } from '../theme/theme';
import { BACKGROUND_SHAPES } from '../theme/backgroundShapes';

export interface ChalmersBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersBackground: React.FC<ChalmersBackgroundProps> = ({
  children,
  style,
  testID,
}) => (
  <View style={[styles.root, style]} testID={testID}>
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      pointerEvents="none"
    >
      {BACKGROUND_SHAPES.map((shape, i) => (
        <Polygon
          key={i}
          points={shape.points}
          fill={colors[shape.token]}
          fillOpacity={shape.opacity}
        />
      ))}
    </Svg>
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: decorative.base,
  },
});

export default ChalmersBackground;
