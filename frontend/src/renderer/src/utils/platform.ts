
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.electron !== 'undefined' && 
         typeof window.api !== 'undefined';
}

export const safeIpc = {
  send: (channel: string, data: any): void => {
    if (isElectron()) {
      // @ts-ignore
      window.api.send(channel, data)
    } else {
      console.log(`[Web Mode] IPC Send: ${channel}`, data)
    }
  },
  on: (channel: string, callback: (...args: any[]) => void): void => {
    if (isElectron()) {
      // @ts-ignore
      window.api.on(channel, callback)
    } else {
      console.log(`[Web Mode] IPC On listener registered for: ${channel}`)
    }
  }
}
