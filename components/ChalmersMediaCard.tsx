/**
 * components/ChalmersMediaCard.tsx
 *
 * Restaurant / event list card with an optional media strip.
 *
 * Measured from the shipping Karappen (v2.2.0-csu): 16dp margins, arc-fit
 * 12.3dp radius, 1dp white-20% hairline border, media strip inset 20dp from
 * the content edge and 72dp tall.
 *
 * The fill is #374750 at 50% - solved with err=0, and `rgba(55, 71, 80, 0.5)`
 * is itself a literal in the app bundle, so it is confirmed twice over. Do not
 * flatten it to an opaque colour: the card is translucent over the decorative
 * wallpaper and must reveal it.
 */
import React from 'react';
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import ChalmersText from './ChalmersText';
import { surfaces, radii, borderWidth, spacing } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

export interface ChalmersMediaCardProps {
  title: string;
  subtitle?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const spec = componentSpecs.mediaCard;

const ChalmersMediaCard: React.FC<ChalmersMediaCardProps> = ({
  title,
  subtitle,
  imageSource,
  onPress,
  children,
  style,
  testID,
}) => {
  // Do NOT write `const Container = onPress ? Pressable : View`. That gives a
  // union component type and `View` rejects `onPress`, so it fails tsc.
  const content = (
    <>
      {/* UNVERIFIED: these two type variants were chosen by eye, not measured
          from the app. Verify on a device before relying on them. */}
      <ChalmersText variant="heading1">{title}</ChalmersText>
      {subtitle !== undefined && (
        <ChalmersText variant="paragraph2" color={surfaces.subText}>
          {subtitle}
        </ChalmersText>
      )}
      {imageSource !== undefined && (
        <Image
          source={imageSource}
          style={styles.image}
          testID={testID ? `${testID}-image` : undefined}
          resizeMode="cover"
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.card, style]}
        testID={testID}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} testID={testID}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    backgroundColor: surfaces.listCard,
    borderWidth: borderWidth.hairline,
    borderColor: surfaces.border,
    marginHorizontal: spec.marginHorizontal,
    paddingHorizontal: spec.imageInset,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  image: {
    height: spec.imageHeight,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
  },
});

export default ChalmersMediaCard;
