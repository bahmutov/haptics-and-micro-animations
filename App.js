import * as React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Audio } from 'expo-av'
// import Reanimated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSequence,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';

// const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

console.log('Haptics is', Haptics)

const notificationSrc = require('./notification.wav')

const { width } = Dimensions.get('window')

const imageUrl =
  'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80'

export default function App() {
  const [isFavorite, setIsFavourite] = React.useState(false)
  const [quantity, setQuantity] = React.useState(1)
  const [cartCount, setCartCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentSound, setSound] = React.useState()
  // const heartScale = useSharedValue(1);
  // const buttonScale = useSharedValue(1);
  const [isEnabled, setIsEnabled] = React.useState(true)

  const handleAddToCart = React.useCallback(async () => {
    setIsLoading(true)

    // if (isEnabled) {
    //   buttonScale.value = withTiming(0.9, { duration: 200 });
    // }

    await wait(1000)

    if (isEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    }

    setCartCount((val) => val + quantity)

    // if (isEnabled) {
    //   buttonScale.value = withTiming(1, { duration: 200 });
    // }

    setIsLoading(false)
  }, [/*buttonScale,*/ quantity, isEnabled])

  const handleSelectQuantity = React.useCallback(
    (newQuantity) => {
      setQuantity(newQuantity)

      if (isEnabled) {
        if (newQuantity === 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } else if (newQuantity === 2) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        }
      }
    },
    [isEnabled],
  )

  const handleToggleFavourite = React.useCallback(async () => {
    setIsFavourite((val) => !val)

    if (isEnabled) {
      if (!isFavorite) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // heartScale.value = withSequence(
        //   withTiming(1.3, { duration: 200 }),
        //   withTiming(1, { duration: 200 }),
        // );
        playSound()
      }
    }
  }, [/*heartScale,*/ isEnabled, isFavorite, playSound])

  const playSound = React.useCallback(async () => {
    const { sound } = await Audio.Sound.createAsync(notificationSrc)
    setSound(sound)
    await sound.playAsync()
  }, [])

  React.useEffect(() => {
    return currentSound ? () => currentSound.unloadAsync() : undefined
  }, [currentSound])

  // const heartStyle = useAnimatedStyle(
  //   () => ({
  //     transform: [{ scale: heartScale.value }],
  //   }),
  //   [],
  // );

  // const buttonStyle = useAnimatedStyle(
  //   () => ({
  //     transform: [{ scale: buttonScale.value }],
  //     opacity: interpolate(buttonScale.value, [0.9, 1], [0.5, 1]),
  //   }),
  //   [],
  // );

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <Image source={{ uri: imageUrl }} style={{ width, height: width }} />
      <View style={styles.favouriteContainer}>
        <Text style={styles.name}>Matcha Latte</Text>
        <Pressable
          onPress={handleToggleFavourite}
          accessibilityLabel="Favorite"
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={50}
            style={styles.favoriteIcon}
          />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.quantity}>
          <View style={styles.quantityOptions}>
            {new Array(3).fill(null).map((_, index) => (
              <QuantityItem
                key={index}
                isSelected={index + 1 === quantity}
                isEnabled={isEnabled}
                onPress={() => handleSelectQuantity(index + 1)}
              >
                {index + 1}
              </QuantityItem>
            ))}
          </View>
        </View>
        <Pressable
          style={[styles.cta /*, buttonStyle*/]}
          onPress={handleAddToCart}
          disabled={isLoading}
          accessibilityLabel="Add to cart"
        >
          {isLoading ? (
            <ActivityIndicator color="white" accessibilityLabel="Loading" />
          ) : (
            <Text style={styles.ctaText}>Add to cart!</Text>
          )}
        </Pressable>
        <Text style={styles.cartCount}>Items in cart: {cartCount}</Text>
        <View style={styles.footer}>
          <Switch
            value={isEnabled}
            onValueChange={() => setIsEnabled((val) => !val)}
          />
          <Text>{isEnabled ? 'Disable' : 'Enable'} enhancements</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export const wait = (numMs) =>
  new Promise((res) => setTimeout(() => res(), numMs))

const QuantityItem = ({ isSelected, onPress, children, isEnabled }) => {
  // const myVal = useSharedValue(isSelected ? 1 : 0);

  // React.useEffect(() => {
  //   if (isEnabled) {
  //     myVal.value = withTiming(isSelected ? 1 : 0, { duration: 400 });
  //   } else {
  //     myVal.value = isSelected ? 1 : 0;
  //   }
  // }, [isSelected, myVal, isEnabled]);

  // const selectedStyle = useAnimatedStyle(
  //   () => ({
  //     opacity: myVal.value,
  //   }),
  //   [],
  // );

  // const notSelectedStyle = useAnimatedStyle(
  //   () => ({
  //     opacity: interpolate(myVal.value, [0, 1], [1, 0]),
  //   }),
  //   [],
  // );

  return (
    <Pressable
      style={styles.quantityButton}
      onPress={onPress}
      accessibilityLabel="Quantity"
    >
      <View
        style={[
          styles.quantityItem,
          styles.selectedQuantity /*, selectedStyle*/,
        ]}
      >
        <Text style={styles.selectedQuantityText}>{children}</Text>
      </View>
      <View
        style={[
          styles.quantityItem,
          styles.notSelectedQuantity,
          /*notSelectedStyle,*/
        ]}
      >
        <Text style={styles.notSelectedQuantityText}>{children}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  favouriteContainer: {
    padding: 10,
    backgroundColor: '#2E8B57',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  favoriteIcon: {
    color: 'white',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  cta: {
    height: 45,
    justifyContent: 'center',
    width: width / 2,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FC7A57',
    borderRadius: 10,
    marginBottom: 30,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  quantity: {
    marginBottom: 30,
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomColor: '#E0E0E2',
    borderBottomWidth: 2,
  },
  quantityButton: {
    height: 50,
    width: 50,
    marginHorizontal: 10,
  },
  quantityItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityOptions: {
    flexDirection: 'row',
  },
  selectedQuantity: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2E8B57',
    borderRadius: 10,
  },
  notSelectedQuantity: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderRadius: 10,
    borderWidth: 2,
  },
  selectedQuantityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  notSelectedQuantityText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cartCount: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  footer: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'space-between',
  },
})
