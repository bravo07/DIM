import React from 'react';
import { DimItem } from '../inventory/item-types';
import InventoryItem from '../inventory/InventoryItem';

export default function LoadoutDrawerItem({
  item,
  equip,
  remove
}: {
  item: DimItem;
  equip(item: DimItem, e: React.MouseEvent): void;
  remove(item: DimItem, e: React.MouseEvent): void;
}) {
  return (
    <div onClick={(e) => equip(item, e)} className="loadout-item">
      <InventoryItem item={item} />
      <div className="close" onClick={(e) => remove(item, e)} />
    </div>
  );
}
