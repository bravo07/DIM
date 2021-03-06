import React from 'react';
import ConnectedInventoryItem from '../inventory/ConnectedInventoryItem';
import ItemPopupTrigger from '../inventory/ItemPopupTrigger';
import { D1Item } from '../inventory/item-types';
import BungieImage from '../dim-ui/BungieImage';
import DraggableInventoryItem from '../inventory/DraggableInventoryItem';

interface Props {
  item: D1Item & { vendorIcon?: string };
  shiftClickCallback?(item: D1Item): void;
}

export default class LoadoutBuilderItem extends React.Component<Props> {
  render() {
    const { item } = this.props;

    if (item.isVendorItem) {
      return (
        <div className="loadout-builder-item">
          <DraggableInventoryItem item={item}>
            <div className="item-overlay-container">
              <div className="vendor-icon-background">
                <BungieImage src={item.vendorIcon!} className="vendor-icon" />
              </div>
              <ConnectedInventoryItem item={item} onClick={this.itemClicked} />
            </div>
          </DraggableInventoryItem>
        </div>
      );
    }

    return (
      <div className="loadout-builder-item">
        <DraggableInventoryItem item={item}>
          <ItemPopupTrigger item={item}>
            <ConnectedInventoryItem item={item} onClick={this.itemClicked} />
          </ItemPopupTrigger>
        </DraggableInventoryItem>
      </div>
    );
  }

  private itemClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey && this.props.shiftClickCallback) {
      e.preventDefault();
      e.stopPropagation();
      this.props.shiftClickCallback(this.props.item);
    }
  };
}
