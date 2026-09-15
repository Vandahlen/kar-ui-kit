/**
 * components/ChalmersTagChip.tsx
 *
 * Category tag shown over event artwork ("MOTEN & WORKSHOP").
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 23dp tall, arc-fit 5.3dp
 * radius, 10dp horizontal padding, 12sp uppercase label in the SECTION ACCENT.
 * The fill solved to pure black at 30% over two different backdrops - it is
 * NOT a tinted grey (a #374750 fit gives inconsistent per-channel alphas).
 */
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ChalmersText from './ChalmersText';
import { surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersTagChipProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersTagChip: React.FC<ChalmersTagChipProps> = ({
  label,
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ChalmersText
        variant="caption1"
        color={theme.primary}
        style={styles.label}
      >
        {label}
      </ChalmersText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.tagChip.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.tagOverlay,
    paddingHorizontal: componentSpecs.tagChip.paddingLeft,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersTagChip;
