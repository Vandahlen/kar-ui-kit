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
 * The shapes are brand tokens at measured opacities over `decorative.base`.
 * See theme/backgroundShapes.ts for provenance.
 *
 * Edges are FEATHERED. The app's own wallpaper asset has soft edges - scanning
 * across a shape boundary in it shows the colour ramping over ~14 asset px
 * (roughly 8dp on screen), not a hard cut. Flat polygons read noticeably
 * crisper than the real thing, so the whole shape group is blurred.
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Polygon,
  Defs,
  Filter,
  FeGaussianBlur,
  G,
} from 'react-native-svg';
import { colors, decorative } from '../theme/theme';
import { BACKGROUND_SHAPES } from '../theme/backgroundShapes';

const FEATHER_ID = 'chalmersBackgroundFeather';

/**
 * Blur radius in viewBox units (the viewBox is 0-100 and stretched with
 * preserveAspectRatio="none", so this scales with the screen the way the
 * app's stretched wallpaper does). Tuned against the asset's measured
 * ~14px edge ramp.
 */
const FEATHER_STD_DEVIATION = 2.75;

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
      <Defs>
        {/* Generous region so the blur is not clipped at the shape bounds. */}
        <Filter id={FEATHER_ID} x="-15%" y="-15%" width="130%" height="130%">
          <FeGaussianBlur stdDeviation={FEATHER_STD_DEVIATION} />
        </Filter>
      </Defs>
      <G filter={`url(#${FEATHER_ID})`}>
        {BACKGROUND_SHAPES.map((shape, i) => (
          <Polygon
            key={i}
            points={shape.points}
            fill={colors[shape.token]}
            fillOpacity={shape.opacity}
          />
        ))}
      </G>
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
