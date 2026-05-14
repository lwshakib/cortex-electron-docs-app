import { version } from "../package.json"

export const RELEASE_BASE_URL =
  "https://github.com/lwshakib/cortex/releases/download"

export const MAC_DOWNLOAD_URL = `${RELEASE_BASE_URL}/v${version}/Cortex-Mac-${version}-Installer.dmg`
export const WINDOWS_DOWNLOAD_URL = `${RELEASE_BASE_URL}/v${version}/Cortex-Windows-${version}-Setup.exe`
export const LINUX_DOWNLOAD_URL = `${RELEASE_BASE_URL}/v${version}/Cortex-Linux-${version}.AppImage`
