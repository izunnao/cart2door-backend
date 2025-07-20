// src/utils/memoryStore.ts
type Store = Record<string, any>

const memoryStore: Store = {}


const memoryManager = {
  set(key: string, value: any) {
    memoryStore[key] = value
  },
  get<T>(key: string): T | undefined {
    return memoryStore[key]
  },
  delete(key: string) {
    delete memoryStore[key]
  },
  clear() {
    Object.keys(memoryStore).forEach(key => delete memoryStore[key])
  }
}


export default memoryManager;