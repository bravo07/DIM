import React from 'react';
import { DimItem } from '../inventory/item-types';
import ItemTagSelector from './ItemTagSelector';
import classNames from 'classnames';
import { t } from 'i18next';
import ExternalLink from '../dim-ui/ExternalLink';
import { settings } from '../settings/settings';
import ExpandedRating from './ExpandedRating';
import styles from './NewItemPopupHeader.m.scss';
import { DestinyAmmunitionType } from 'bungie-api-ts/destiny2';

export default function NewItemPopupHeader({
  item
}: {
  item: DimItem;
  expanded: boolean;
  onToggleExpanded(): void;
}) {
  const light = item.primStat ? item.primStat.value.toString() : undefined;

  // TODO: lock, track, rating, tag

  const classType =
    item.classTypeName !== 'unknown' &&
    // These already include the class name
    item.type !== 'ClassItem' &&
    item.type !== 'Artifact' &&
    item.type !== 'Class' &&
    item.classTypeNameLocalized[0].toUpperCase() + item.classTypeNameLocalized.slice(1);

  // TODO: localize
  const ammoNames = {
    [DestinyAmmunitionType.Primary]: 'Primary',
    [DestinyAmmunitionType.Special]: 'Special',
    [DestinyAmmunitionType.Heavy]: 'Heavy'
  };
  /* TODO: handle consumables/bounties/etc differently */

  const ammoClasses = {
    [DestinyAmmunitionType.Primary]: styles.primaryAmmo,
    [DestinyAmmunitionType.Special]: styles.specialAmmo,
    [DestinyAmmunitionType.Heavy]: styles.heavyAmmo
  };

  const elements = {
    arc: styles.arcIcon,
    void: styles.voidIcon,
    solar: styles.solarIcon
  };

  return (
    <div className={classNames(styles.itemHeader, `is-${item.tier}`)}>
      <div className={styles.titleContainer}>
        <div className={styles.itemTitle}>
          <ExternalLink href={destinyDBLink(item)}>{item.name}</ExternalLink>
        </div>
        <div className={styles.subTitle}>
          <div>
            {classType ? classType + ' ' : ''}
            {item.typeName}
          </div>
          {/* TODO: use localized tier */}
          <div>{item.tier}</div>
        </div>
      </div>

      <div className={styles.subSection}>
        {item.equipRequiredLevel && <div>Requires Level {item.equipRequiredLevel}</div>}
        <div className={styles.powerInfo}>
          <div className={styles.powerElement}>
            {item.dmg && item.dmg !== 'kinetic' && <div className={elements[item.dmg]} />} {light}{' '}
            {item.primStat && item.primStat.stat.statName}
          </div>
          {item.isDestiny2() && item.ammoType > 0 && (
            <div className={styles.ammo}>
              <div className={ammoClasses[item.ammoType]} />
              {ammoNames[item.ammoType]}
            </div>
          )}
        </div>
      </div>

      {item.objectives && !item.hidePercentage && (
        <div>{t('ItemService.PercentComplete', { percent: item.percentComplete })}</div>
      )}

      {item.taggable && <ItemTagSelector item={item} />}

      {item.reviewable && <ExpandedRating item={item} />}

      {item.uniqueStack && (
        <div>
          {item.amount === item.maxStackSize
            ? t('MovePopup.Subtitle', { amount: item.amount, context: 'Stackable_UniqueMax' })
            : t('MovePopup.Subtitle', {
                amount: item.amount,
                maxStackSize: item.maxStackSize,
                context: 'Stackable_Unique'
              })}
        </div>
      )}
    </div>
  );
}

function destinyDBLink(item: DimItem) {
  // DTR 404s on the new D2 languages for D1 items
  let language = settings.language;
  if (item.destinyVersion === 1) {
    switch (language) {
      case 'es-mx':
        language = 'es';
        break;
      case 'pl':
      case 'ru':
      case 'zh-cht':
      case 'zh-chs':
        language = 'en';
        break;
    }
  } else {
    // For D2, DTR uses English for es-mx
    switch (language) {
      case 'es-mx':
        language = 'es';
        break;
    }
  }
  return `http://db.destinytracker.com/d${item.destinyVersion}/${settings.language}/items/${
    item.hash
  }`;
}
