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
import { AppIcon, lockIcon } from '../shell/icons';

export default function NewItemPopupHeader({
  item
}: {
  item: DimItem;
  expanded: boolean;
  onToggleExpanded(): void;
}) {
  const light = item.primStat ? item.primStat.value.toString() : undefined;

  // TODO: lock, track, rating, tag
  // TODO: is the subheader too large?
  // TODO: only show level if not all chars can get there?
  // TODO: use destiny-icons and add the release icon on the corner??
  // TODO: move the power stuff into the details tab???

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
      <div className={classNames(styles.titleContainer, { [styles.masterwork]: item.masterwork })}>
        <div className={styles.itemTitle}>
          <ExternalLink href={destinyDBLink(item)}>{item.name}</ExternalLink>
        </div>
        <div className={styles.subTitle}>
          <div>
            {classType ? classType + ' ' : ''}
            {item.typeName}
          </div>
          {/* TODO: use localized tier */}
          <div>
            <span>{item.tier}</span>
            {/* TODO: this is too close to the close button */}
            {item.locked && <AppIcon icon={lockIcon} />}
          </div>
        </div>
      </div>

      <div className={styles.subSection}>
        {item.equipRequiredLevel > 0 && (
          <div className={styles.requiredLevel}>Requires Level {item.equipRequiredLevel}</div>
        )}
        <div className={styles.powerInfo}>
          <div className={elements[item.dmg] || styles.powerElement}>
            {item.dmg && item.dmg !== 'kinetic' && <div className={styles.element} />} {light}
            {(!item.isDestiny2() || item.ammoType === 0) && (
              <span className={styles.primaryStatName}>Power</span>
            )}
          </div>
          {item.isDestiny2() && item.ammoType > 0 && (
            <div className={styles.ammo}>
              <div className={ammoClasses[item.ammoType]} />
              {ammoNames[item.ammoType]}
            </div>
          )}
          <div className={styles.extraStuff}>
            {item.objectives && !item.hidePercentage && (
              <div>{t('ItemService.PercentComplete', { percent: item.percentComplete })}</div>
            )}

            {item.taggable && <ItemTagSelector item={item} />}

            {item.reviewable && <ExpandedRating item={item} />}
          </div>
        </div>
      </div>
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
