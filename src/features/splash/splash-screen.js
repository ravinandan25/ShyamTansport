import {Icon, Text, useTheme} from '@rneui/themed';
import React, {useEffect, useRef} from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

import {palette} from '../../theme/palettes';
const TRUCK_SIZE = 96; // must match res/drawable/splash_truck.xml
// Same in light and dark mode, to match the native splash (res/values/colors.xml).
const SPLASH_BACKGROUND = palette.light.primary;
const BAR_WIDTH = 120;

// Starts on exactly the frame the native splash shows (truck centred on the
// brand colour), animates the name in, then fades out to reveal the app.
function SplashScreen({onFinish}) {
  const {theme} = useTheme();
  const truckLift = useRef(new Animated.Value(0)).current;
  const truckDrive = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    const ease = Easing.out(Easing.cubic);

    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (cancelled) {
        return;
      }
      const intro = reduceMotion
        ? Animated.timing(text, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          })
        : Animated.parallel([
            Animated.timing(truckLift, {
              toValue: 1,
              duration: 600,
              easing: ease,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(truckDrive, {
                toValue: 1,
                duration: 350,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.spring(truckDrive, {
                toValue: 0,
                friction: 4,
                useNativeDriver: true,
              }),
            ]),
            Animated.timing(text, {
              toValue: 1,
              duration: 500,
              delay: 250,
              easing: ease,
              useNativeDriver: true,
            }),
            Animated.timing(progress, {
              toValue: 1,
              duration: 1100,
              delay: 300,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),
          ]);

      Animated.sequence([
        intro,
        Animated.delay(reduceMotion ? 400 : 150),
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => !cancelled && onFinish());
    });

    return () => {
      cancelled = true;
    };
  }, [fadeOut, onFinish, progress, text, truckDrive, truckLift]);

  const textStyle = {
    opacity: text,
    transform: [
      {
        translateY: text.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {backgroundColor: SPLASH_BACKGROUND, opacity: fadeOut},
      ]}
      accessibilityLabel="Shyam Transport is loading">
      <View style={styles.anchor}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: truckLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -56],
                }),
              },
              {
                translateX: truckDrive.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
              {
                scale: truckLift.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.85],
                }),
              },
            ],
          }}>
          <Icon
            name="local-shipping"
            type="material"
            color="white"
            size={TRUCK_SIZE}
          />
        </Animated.View>

        <View style={styles.textBlock}>
          <Animated.Text style={[styles.title, textStyle]}>
            Shyam Transport
          </Animated.Text>
          <Animated.View style={textStyle}>
            <Text style={styles.tagline}>
              Quotations and invoices on the go
            </Text>
          </Animated.View>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.bar,
                {
                  backgroundColor: theme.colors.secondary,
                  transform: [
                    {
                      translateX: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-BAR_WIDTH, 0],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // Same size as the truck so it sits exactly where the native splash drew it.
  anchor: {
    width: TRUCK_SIZE,
    height: TRUCK_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    position: 'absolute',
    top: TRUCK_SIZE / 2 + 4,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 6,
  },
  track: {
    width: BAR_WIDTH,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
    marginTop: 28,
  },
  bar: {
    width: BAR_WIDTH,
    height: 4,
    borderRadius: 2,
  },
});
