import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, styleOf } from '../test-utils';
import ChalmersSegmentedControl from './ChalmersSegmentedControl';
import { surfaces, radii, colors } from '../theme/theme';
import { componentSpecs } from '../theme/componentSpecs';

const SEGMENTS = ['EVENTKALENDER', 'BOKNINGAR'];

test('matches the measured container geometry', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
  );
  const s = styleOf(r, 'sc');
  expect(s.height).toBe(componentSpecs.segmentedControl.height);
  expect(s.borderRadius).toBe(radii.control);
  expect(s.backgroundColor).toBe(surfaces.chrome);
});

test('fills the active segment with the section accent', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
    'event',
  );
  const s = styleOf(r, 'sc-segment-0');
  expect(s.backgroundColor).toBe(colors.orange);
  expect(s.height).toBe(componentSpecs.segmentedControl.activeHeight);
});

test('leaves the inactive segment unfilled', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
    'event',
  );
  expect(styleOf(r, 'sc-segment-1').backgroundColor).toBeUndefined();
});

test('renders every segment label', () => {
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={() => {}}
    />,
  );
  const labels = r.root.findAllByType(Text).map(n => n.props.children);
  expect(labels).toEqual(SEGMENTS);
});

test('reports the tapped index', () => {
  const onChange = jest.fn();
  const r = renderWithTheme(
    <ChalmersSegmentedControl
      testID="sc"
      segments={SEGMENTS}
      selectedIndex={0}
      onChange={onChange}
    />,
  );
  const pressable = r.root
    .findAllByProps({ testID: 'sc-segment-1' })
    .find(n => typeof n.type !== 'string' && n.props.onPress);
  pressable!.props.onPress();
  expect(onChange).toHaveBeenCalledWith(1);
});
