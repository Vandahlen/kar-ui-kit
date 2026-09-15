/**
 * components/ChalmersButton.tsx
 *
 * Button primitive implementing the three button states from the
 * profile: Primärknapp (filled pill), Sekundärknapp (text link),
 * and Disable (muted, reduced-opacity).
 */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import ChalmersText from './ChalmersText';
import { colors, radii, spacing, surfaces } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

/**
 * `chip` is the compact translucent action on a coloured surface (e.g. the
 * balance card's "Fyll pa, bestall & betala"). Added as a variant rather than
 * an orthogonal `shape` prop because secondary+chip is not a real combination.
 */
export type ChalmersButtonVariant = 'primary' | 'secondary' | 'chip';

export interface ChalmersButtonProps {
  label: string;
  onPress: () => void;
  variant?: ChalmersButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const ChalmersButton: React.FC<ChalmersButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  testID,
}) => {
  const isDisabled = disabled || loading;
  const theme = useTheme();

  if (variant === 'chip') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.chipContainer, isDisabled && styles.chipDisabled, style]}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <ChalmersText
            variant="paragraph1"
            color={colors.white}
            style={styles.primaryLabel}
          >
            {label}
          </ChalmersText>
        )}
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={styles.secondaryContainer}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        <ChalmersText
          variant="paragraph1"
          color={isDisabled ? theme.disabledText : colors.bla}
        >
          {label}
        </ChalmersText>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.primaryContainer,
        isDisabled && { backgroundColor: theme.disabledBackground },
        style,
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <ChalmersText
          variant="paragraph1"
          color={isDisabled ? theme.disabledText : colors.white}
          style={styles.primaryLabel}
        >
          {label}
        </ChalmersText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Measured from the shipping app: 50dp tall, 16dp radius (NOT a pill).
  primaryContainer: {
    backgroundColor: colors.bla,
    borderRadius: radii.button,
    minHeight: 50,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontWeight: '600',
  },
  // Measured: 32dp tall, 12dp radius, white@20% fill, 16sp label, ~12dp inset.
  chipContainer: {
    backgroundColor: surfaces.overlay,
    borderRadius: radii.chip,
    height: 32,
    paddingHorizontal: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDisabled: {
    opacity: 0.4,
  },
  secondaryContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChalmersButton;
