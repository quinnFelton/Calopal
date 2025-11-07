import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');



//Speed is measured as milisecond for the purposes of random calcs and timeout purposes.
export default function CatAnim({source, size = 100, speed = 1000, visible = true}) {
    const x = useSharedValue(width / 2);
    const y = useSharedValue(height / 2);
    const tabBarHeight = useBottomTabBarHeight();

    const animStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: x.value - size / 2}, {translateY: y.value - size / 2}],
        }
    }, []);

    const minX = 0 - size * 0.35;
    const maxX = width - size * 1.4;
    const minY = width;
    const maxY = height - tabBarHeight - size;

    const randomPosition = () => ({
        max_x: width - size * 1.4,
        x: Math.random() * (maxX - minX + 1) + minX,
        y: Math.random() * (maxY - minY + 1) + minY,
    })

    const move = () => {
        const { x: newX, y: newY } = randomPosition();
        x.value = withTiming(newX, {
            duration: speed + Math.random() * 2000,
            easing: Easing.inOut(Easing.quad),
        });
        y.value = withTiming(newY, {
            duration: speed + Math.random() * 2000,
            easing: Easing.inOut(Easing.quad),
        });
    };

    useEffect(() => {
        let timeout;
        const loop = () => {
        move();
        timeout = setTimeout(loop, Math.random() * (5000 - 1500 + 1) + 1500);
        };
        loop();

        return () => clearTimeout(timeout);
    });

    return (
        <Animated.Image source={source} style={[{ position: "absolute", width: size, height: size, resizeMode:'none', opacity: visible ? 1 : 0}, animStyle]}/>
    );
}
