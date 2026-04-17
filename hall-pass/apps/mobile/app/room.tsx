import { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, PanResponder, SafeAreaView } from 'react-native';
import { useGameStore, furnitureCatalog, getFurnitureByCategory } from '@hallpass/game-engine';
import { Button, Card, colors, spacing } from '@hallpass/shared-ui';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const ROOM_WIDTH = screenWidth - 40;
const ROOM_HEIGHT = ROOM_WIDTH * 0.75;

// Room furniture item component
function PlacedFurniture({ item, onMove }: { item: any; onMove: (id: string, x: number, y: number) => void }) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        onMove(item.id, item.position.x + gestureState.dx / ROOM_WIDTH, item.position.y + gestureState.dy / ROOM_HEIGHT);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.furnitureItem,
        {
          left: item.position.x * ROOM_WIDTH,
          top: item.position.y * ROOM_HEIGHT,
          width: (item.item?.dimensions?.width || 1) * 50,
          height: (item.item?.dimensions?.height || 1) * 50,
          backgroundColor: colors.primary,
        },
      ]}
    />
  );
}

export default function RoomScreen() {
  const router = useRouter();
  const room = useGameStore((state) => state.room);
  const addFurniture = useGameStore((state) => state.addFurniture);
  const moveFurniture = useGameStore((state) => state.moveFurniture);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  const categories = ['bed', 'desk', 'chair', 'storage', 'decor', 'lighting', 'wall'];

  const handleAddFurniture = (item: any) => {
    addFurniture(item, { x: 0.5, y: 0.5, rotation: 0 }, 'center');
    setShowCatalog(false);
  };

  const handleMoveFurniture = (id: string, x: number, y: number) => {
    moveFurniture(id, { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), rotation: 0 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Room View */}
      <View style={styles.roomContainer}>
        <View style={styles.room}>
          {/* Floor */}
          <View style={styles.floor}>
            {room.floorItems.map((item) => (
              <PlacedFurniture key={item.id} item={item} onMove={handleMoveFurniture} />
            ))}
          </View>
          
          {/* Walls */}
          <View style={styles.walls}>
            {room.wallItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.wallItem,
                  {
                    left: item.position.x * ROOM_WIDTH,
                    top: item.position.y * 100,
                    backgroundColor: colors.accentPink,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Add Furniture" onPress={() => setShowCatalog(!showCatalog)} />
        <Button title="Edit Walls" onPress={() => {}} variant="secondary" />
        <Button title="Back" onPress={() => router.back()} variant="ghost" />
      </View>

      {/* Furniture Catalog */}
      {showCatalog && (
        <Card style={styles.catalog}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map((cat) => (
              <Button
                key={cat}
                title={cat}
                onPress={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'primary' : 'secondary'}
                size="sm"
              />
            ))}
          </ScrollView>
          
          {selectedCategory && (
            <ScrollView style={styles.itemList}>
              {getFurnitureByCategory(selectedCategory).map((item) => (
                <Button
                  key={item.id}
                  title={`${item.name} (${item.price} ${item.currency})`}
                  onPress={() => handleAddFurniture(item)}
                  variant="secondary"
                  style={styles.catalogItem}
                />
              ))}
            </ScrollView>
          )}
        </Card>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  roomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  room: {
    width: ROOM_WIDTH,
    height: ROOM_HEIGHT,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  floor: {
    flex: 1,
    backgroundColor: '#2a2a4a',
    position: 'relative',
  },
  walls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: colors.bgCard,
  },
  furnitureItem: {
    position: 'absolute',
    borderRadius: 4,
  },
  wallItem: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  catalog: {
    position: 'absolute',
    bottom: 100,
    left: spacing.lg,
    right: spacing.lg,
    maxHeight: 300,
  },
  categoryList: {
    marginBottom: spacing.md,
  },
  itemList: {
    maxHeight: 200,
  },
  catalogItem: {
    marginBottom: spacing.sm,
  },
});
