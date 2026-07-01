import WardrobePage from '@/pages/wardrobe/WardrobePage';

export default function WardrobeRoute({
  wardrobe,
  selectedOutfit,
  setSelectedOutfit,
  activeFilter,
  setActiveFilter,
  onAddItem,
  onDeleteItem,
  onEditItem,
  isGuest,
}) {
  return (
    <WardrobePage
      wardrobe={wardrobe}
      selectedOutfit={selectedOutfit}
      setSelectedOutfit={setSelectedOutfit}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      onAddItem={onAddItem}
      onDeleteItem={onDeleteItem}
      onEditItem={onEditItem}
      isGuest={isGuest}
    />
  );
}
