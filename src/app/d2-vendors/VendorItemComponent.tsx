import { VendorItem } from './vendor-item';
import React from 'react';
import BungieImage from '../dim-ui/BungieImage';
import classNames from 'classnames';
import { D2ManifestDefinitions } from '../destiny2/d2-definitions.service';
import { DestinyItemQuantity, DestinyCollectibleState } from 'bungie-api-ts/destiny2';
import { UISref } from '@uirouter/react';
import ConnectedInventoryItem from '../inventory/ConnectedInventoryItem';
import ItemPopupTrigger from '../inventory/ItemPopupTrigger';
import '../progress/milestone.scss';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from '../shell/icons';

export default function VendorItemComponent({
  item,
  defs,
  owned
}: {
  defs: D2ManifestDefinitions;
  item: VendorItem;
  owned: boolean;
}) {
  if (item.displayTile) {
    return (
      <div className="vendor-item">
        <UISref to="destiny2.vendor" params={{ id: item.previewVendorHash }}>
          <BungieImage
            className="vendor-tile"
            title={item.displayProperties.name}
            src={item.displayProperties.icon}
          />
        </UISref>
        {item.displayProperties.name}
      </div>
    );
  }

  if (!item.item) {
    return null;
  }

  const itemDef = defs.InventoryItem.get(item.item.hash);
  const rewards = (itemDef.value ? itemDef.value.itemValue.filter((v) => v.itemHash) : []).map(
    (iq) => ({
      quantity: iq.quantity,
      item: defs.InventoryItem.get(iq.itemHash)
    })
  );

  const collectible =
    itemDef.collectibleHash !== undefined
      ? defs.Collectible.get(itemDef.collectibleHash)
      : undefined;

  // TODO: This will never be set, since the profile data isn't being merged in when creating the vendor items.
  // We need to load the whole profile again!
  const acquired =
    item.item.collectibleState !== null &&
    !(item.item.collectibleState & DestinyCollectibleState.NotAcquired);

  return (
    <div
      className={classNames('vendor-item', {
        owned,
        unavailable: !item.canPurchase || !item.canBeSold
      })}
    >
      {owned ? (
        <AppIcon className="owned-icon" icon={faCheck} />
      ) : (
        acquired && <AppIcon className="acquired-icon" icon={faCheck} />
      )}
      <ItemPopupTrigger
        item={item.item}
        extraData={{ rewards, failureStrings: item.failureStrings, collectible, owned, acquired }}
      >
        <ConnectedInventoryItem item={item.item} allowFilter={true} />
      </ItemPopupTrigger>
      {item.costs.length > 0 && (
        <div className="vendor-costs">
          {item.costs.map((cost) => (
            <VendorItemCost key={cost.itemHash} defs={defs} cost={cost} />
          ))}
        </div>
      )}
    </div>
  );
}

function VendorItemCost({
  cost,
  defs
}: {
  defs: D2ManifestDefinitions;
  cost: DestinyItemQuantity;
}) {
  const currencyItem = defs.InventoryItem.get(cost.itemHash);
  return (
    <div className="cost">
      {cost.quantity}{' '}
      <span className="currency">
        <BungieImage
          src={currencyItem.displayProperties.icon}
          title={currencyItem.displayProperties.name}
        />
      </span>
    </div>
  );
}
