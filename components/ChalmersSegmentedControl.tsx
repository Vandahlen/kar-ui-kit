/**
 * components/ChalmersSegmentedControl.tsx
 *
 * Two-segment switch (EVENTKALENDER / BOKNINGAR on the event tab).
 *
 * Measured from the shipping Karappen (v2.2.0-csu): container 44dp tall with
 * an arc-fit 4.7dp radius on #374750; active pill 26dp tall, same radius,
 * inset 5dp horizontally and 9dp vertically, filled with the SECTION ACCENT.
 * Labels are 12sp uppercase - active white, inactive #9BA3A7.
 */
import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import ChalmersText from './ChalmersText';
import { colors, surfaces, radii } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';
import { useTheme } from '../theme/ThemeContext';

export interface ChalmersSegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const spec = componentSpecs.segmentedControl;

const ChalmersSegmentedControl: React.FC<ChalmersSegmentedControlProps> = ({
  segments,
  selectedIndex,
  onChange,
  style,
  testID,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {segments.map((label, i) => {
        const active = i === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(i)}
            testID={testID ? `${testID}-segment-${i}` : undefined}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.segment,
              active && { backgroundColor: theme.primary },
            ]}
          >
            <ChalmersText
              variant="caption1"
              color={active ? colors.white : surfaces.mutedLabel}
              style={styles.label}
            >
              {label}
            </ChalmersText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: spec.height,
    borderRadius: radii.control,
    backgroundColor: surfaces.chrome,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spec.activeInset,
  },
  segment: {
    flex: 1,
    height: spec.activeHeight,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

export default ChalmersSegmentedControl;
