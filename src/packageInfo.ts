const REGISTRY_URL = 'https://registry.npmjs.com';
const WEEK_DOWNLOADS_URL = 'https://api.npmjs.org/downloads/point/last-week';

export async function getPackageInfo(name: string): Promise<PackageInfo> {
  const [packageRes, downloadsRes] = await Promise.all([
    fetch(`${REGISTRY_URL}/${name}`),
    fetch(`${WEEK_DOWNLOADS_URL}/${name}`),
  ]);

  if (!packageRes.ok) {
    throw new Error('Could not get package info from NPM.');
  }
  const packageInfo: NpmRegistryInfo = await packageRes.json();

  // Default the downloads to 0, because the API call returns an error for very new packages which do exist.
  let downloadsInfo: NpmDownloadsInfo = { downloads: 0 };
  if (downloadsRes.ok) {
    downloadsInfo = await downloadsRes.json();
  }

  return npmRegistryInfoToPackageInfo(packageInfo, downloadsInfo);
}

export interface PackageInfo {
  name: string;
  version: string;
  dependencies: number;
  size: number;
  date: string;
  license: string;
  weeklyDownloads: number;
}

interface NpmRegistryInfo {
  name: string;
  'dist-tags': {
    latest: string;
  };
  versions: Record<
    string,
    {
      dependencies: Record<string, string>;
      dist: {
        unpackedSize: number;
      };
    }
  >;
  time: Record<string, string>;
  license: string;
}

interface NpmDownloadsInfo {
  downloads: number;
}

function npmRegistryInfoToPackageInfo(
  npm: NpmRegistryInfo,
  downloads: NpmDownloadsInfo
): PackageInfo {
  const version = npm['dist-tags'].latest;
  const versionInfo = npm.versions[version];

  return {
    name: npm.name,
    version,
    dependencies: Object.keys(versionInfo.dependencies || {}).length,
    size: versionInfo.dist.unpackedSize,
    date: npm.time[version],
    license: npm.license,
    weeklyDownloads: downloads.downloads,
  };
}
