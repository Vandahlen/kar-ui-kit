/**
 * components/ChalmersSearchField.tsx
 *
 * Search input used on the mat and event tabs.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 42dp tall, arc-fit 4.7dp
 * radius, opaque #374750 fill, 15dp left padding, 16sp placeholder.
 */
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import SearchIcon from './icons/SearchIcon';
import { surfaces, radii, typography, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersSearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Screen-reader label. Defaults to the placeholder. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersSearchField: React.FC<ChalmersSearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = 'Sök',
  accessibilityLabel,
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <SearchIcon size={20} color={surfaces.subText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={surfaces.subText}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: componentSpecs.searchField.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: componentSpecs.searchField.paddingLeft,
    gap: spacing.sm + 4,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: typography.paragraph1.fontFamily,
    fontSize: componentSpecs.searchField.placeholderSize,
  },
});

export default ChalmersSearchField;
