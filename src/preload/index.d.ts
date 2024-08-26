import { ElectronAPI } from '@electron-toolkit/preload'
import { DAOs } from '../main/data/dao'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: object;
  }
}
