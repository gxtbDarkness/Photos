import { ElectronAPI } from '@electron-toolkit/preload'
import { DAOs } from '../main/data/dao'
import { API } from '../main/api'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
