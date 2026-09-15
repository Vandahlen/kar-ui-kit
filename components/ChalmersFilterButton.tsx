/**
 * components/ChalmersFilterButton.tsx
 *
 * "FILTER" / "FILTER (n)" button that shares a row with ChalmersSearchField.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 42dp tall, arc-fit 4.3dp
 * radius, opaque #374750 fill, 21dp left padding, 12sp uppercase label.
 * The bars icon takes the section accent; the label takes the text colour.
 */
import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import ChalmersText from './ChalmersText';
import FilterIcon from './icons/FilterIcon';
import { surfaces, radii, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersFilterButtonProps {
  onPress: () => void;
  label?: string;
  count?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersFilterButton: React.FC<ChalmersFilterButtonProps> = ({
  onPress,
  label = 'FILTER',
  count,
  style,
  testID,
}) => {
  const theme = useTheme();
  const text = count === undefined ? label : `${label} (${count})`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="button"
    >
      <ChalmersText variant="caption1" color={theme.text} style={styles.label}>
        {text}
      </ChalmersText>
      <FilterIcon size={20} color={theme.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.filterButton.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: componentSpecs.filterButton.paddingLeft,
    gap: spacing.sm + 2,
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersFilterButton;
