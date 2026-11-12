import { AgentDrawer } from './AgentDrawer.tsx'

export function AgentMount({ woId }: { woId?: string }) {
  return <AgentDrawer woId={woId} />
}
