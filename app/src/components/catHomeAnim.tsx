import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useOnboarding } from "../hooks/onboardingHook";

const { width, height } = Dimensions.get('window');



//Speed is measured as milisecond for the purposes of random calcs and timeout purposes.
export default function CatAnim({size = 100, speed = 1000}) {
    const { user, updateLastLoggedIn, refresh: refreshUser } = useOnboarding();

    const x = useSharedValue(width / 2);
    const y = useSharedValue(height / 2);
    const isMove = useSharedValue(false);
    const tabBarHeight = useBottomTabBarHeight();

    const catState = 'happy';
    
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
            duration: speed + Math.random() * 5000,
            easing: Easing.inOut(Easing.quad),
        });
        y.value = withTiming(newY, {
            duration: speed + Math.random() * 5000,
            easing: Easing.inOut(Easing.quad),
        });
    };

    useEffect(() => {
        let timeout;
        const loop = () => {
        move();
        timeout = setTimeout(loop, Math.random() * (10000 - 5000 + 1) + 5000);
        };
        loop();

        return () => clearTimeout(timeout);
    });

    let tempSource = require('../../../assets/images/Cat Assets/cat_sit_neutral.png');
    if (catState == 'happy') {
        tempSource =  require('../../../assets/images/Cat Assets/cat_sit_happy.png')
    } else if (catState == 'veryHappy') {
        tempSource = require('../../../assets/images/Cat Assets/cat_sit_very_happy.png')
    } else if (catState == 'angry') {
        tempSource = require('../../../assets/images/Cat Assets/cat_sit_angry.png')
    } else if (catState == 'sad') {
        tempSource = require('../../../assets/images/Cat Assets/cat_sit_sad.png')
    }

    return (
        <Animated.Image source={tempSource} style={[{ position: "absolute", width: size, height: size, resizeMode:'none'}, animStyle]}/>
    );
}
