# Layout System Architecture

A comprehensive, scalable layout system for your dating app built with React Native and NativeWind.

## Architecture Overview

### 1. **Layout Constants** (`constants/layout.ts`)
Centralized spacing, sizing, and breakpoint system:
- **Spacing Scale**: 8px base unit (xs: 4px → 3xl: 64px)
- **Border Radius**: Consistent rounded corners
- **Screen Dimensions**: Responsive breakpoints
- **Container Widths**: Max-width presets
- **Z-Index Scale**: Layering system
- **Layout Presets**: Dating app specific dimensions

### 2. **Base Layout Components** (`components/layouts/`)

#### `Screen`
Base component for all screens with safe area handling:
```tsx
<Screen safe={true} themed={true}>
  {/* Your content */}
</Screen>
```

#### `Container`
Consistent content width and padding:
```tsx
<Container maxWidth="lg" paddingX="md" paddingY="lg">
  {/* Your content */}
</Container>
```

#### `Card`
Reusable card with variants:
```tsx
<Card variant="elevated" padding="md" radius="lg">
  {/* Card content */}
</Card>
```

#### `Stack` & `Row`
Layout primitives for vertical/horizontal spacing:
```tsx
<Stack spacing="md" align="center">
  <View>Item 1</View>
  <View>Item 2</View>
</Stack>

<Row spacing="sm" justify="space-between">
  <View>Left</View>
  <View>Right</View>
</Row>
```

### 3. **Dating App Specific Layouts**

#### `ProfileCard`
Main profile display card for swipe screens:
```tsx
<ProfileCard
  imageUrl="https://..."
  name="John"
  age={28}
  distance={5}
/>
```

#### `MatchCard`
Compact card for matches list:
```tsx
<MatchCard
  imageUrl="https://..."
  name="Jane"
  onPress={() => {}}
/>
```

#### `SwipeContainer`
Container for swipe-based screens:
```tsx
<SwipeContainer>
  {/* Swipeable profiles */}
</SwipeContainer>
```

### 4. **Responsive Utilities**

#### `useResponsive` Hook
```tsx
const { isSmall, isMedium, isLarge, getValue } = useResponsive();

const padding = getValue({
  small: Spacing.sm,
  medium: Spacing.md,
  large: Spacing.lg,
  default: Spacing.md,
});
```

## Usage Examples

### Basic Screen Layout
```tsx
import { Screen, Container, Stack, Card } from '@/components/layouts';

export default function MyScreen() {
  return (
    <Screen>
      <Container>
        <Stack spacing="lg">
          <Card variant="elevated">
            <Text>Card 1</Text>
          </Card>
          <Card variant="outlined">
            <Text>Card 2</Text>
          </Card>
        </Stack>
      </Container>
    </Screen>
  );
}
```

### Dating App Profile Screen
```tsx
import { SwipeContainer, ProfileCard } from '@/components/layouts';

export default function ExploreScreen() {
  return (
    <SwipeContainer>
      <ProfileCard
        imageUrl={profile.image}
        name={profile.name}
        age={profile.age}
        distance={profile.distance}
      />
    </SwipeContainer>
  );
}
```

### Responsive Layout
```tsx
import { useResponsive } from '@/hooks/use-responsive';
import { Container } from '@/components/layouts';

export default function ResponsiveScreen() {
  const { isTablet, getValue } = useResponsive();
  
  return (
    <Container maxWidth={getValue({
      small: 'full',
      medium: 'md',
      large: 'lg',
      default: 'md',
    })}>
      {/* Content */}
    </Container>
  );
}
```

## Best Practices

### 1. **Always Use Screen Component**
Wrap all screens with `<Screen>` for consistent safe area handling:
```tsx
<Screen>
  {/* Your screen content */}
</Screen>
```

### 2. **Use Container for Content Width**
Don't manually set max-widths, use `<Container>`:
```tsx
<Container maxWidth="lg"> {/* Good */}
<View style={{ maxWidth: 1024 }}> {/* Avoid */}
```

### 3. **Use Spacing Constants**
Always use spacing constants, never magic numbers:
```tsx
padding: Spacing.md  {/* Good */}
padding: 16          {/* Avoid */}
```

### 4. **Combine with NativeWind**
You can mix layout components with NativeWind classes:
```tsx
<Card className="bg-white dark:bg-gray-800">
  <Text className="text-lg font-bold">Title</Text>
</Card>
```

### 5. **Use Layout Variants**
For common patterns, use predefined variants:
```tsx
import { LayoutVariants } from '@/components/layouts/layout-variants';

<View style={LayoutVariants.profile.header}>
  {/* Profile header */}
</View>
```

## File Structure

```
components/layouts/
  ├── index.ts              # Exports
  ├── container.tsx         # Container component
  ├── screen.tsx            # Screen wrapper
  ├── card.tsx              # Card component
  ├── stack.tsx             # Vertical stack
  ├── row.tsx               # Horizontal row
  ├── profile-card.tsx      # Dating: Profile card
  ├── match-card.tsx        # Dating: Match card
  ├── swipe-container.tsx   # Dating: Swipe container
  └── layout-variants.ts    # Predefined variants

constants/
  └── layout.ts             # Layout constants

hooks/
  └── use-responsive.ts     # Responsive utilities
```

## Next Steps

1. **Update existing screens** to use new layout components
2. **Create more dating-specific layouts** as needed (ChatBubble, MessageList, etc.)
3. **Extend spacing system** if needed for your design
4. **Add animations** to layout transitions
5. **Create layout templates** for common screen patterns
