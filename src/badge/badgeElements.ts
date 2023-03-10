import { PackageInfo } from '../packageInfo';
import { formatNumber } from '../utils/formatNumber';
import { COLORS } from './colors';
import { timeAgo } from '../utils/timeAgo';
import { FONTS } from './fonts';

export interface BadgeElements {
  npmLogo: TextElement;
  installCommand: TextElement;
  version: TextElement;
  dependencyCount: TextElement;
  weeklyDownload: TextElement;
  updated: TextElement;
}

export interface TextElement {
  text: string;
  font: string;
  color: string;
}

export function getBadgeElements(pkg: PackageInfo): BadgeElements {
  return {
    npmLogo: {
      text: 'npm',
      font: FONTS.npm,
      color: COLORS.red,
    },
    installCommand: {
      text: `npm install ${pkg.name}`,
      font: FONTS.bold,
      color: COLORS.darkGrey,
    },
    version: {
      text: `version ${pkg.version}`,
      font: FONTS.regular,
      color: COLORS.darkGrey,
    },
    dependencyCount: {
      text: `${pkg.dependencies} dependenc${
        pkg.dependencies === 1 ? 'y' : 'ies'
      }`,
      font: FONTS.regular,
      color: COLORS.darkGrey,
    },
    weeklyDownload: {
      text: `${formatNumber(pkg.weeklyDownloads)} weekly download${
        pkg.weeklyDownloads === 1 ? '' : 's'
      }`,
      font: FONTS.regular,
      color: COLORS.darkGrey,
    },
    updated: {
      text: `updated ${timeAgo(pkg.date)}`,
      font: FONTS.regular,
      color: COLORS.darkGrey,
    },
  };
}
