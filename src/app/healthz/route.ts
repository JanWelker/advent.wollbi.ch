// The readiness and liveness probes. It answers without touching the
// database on purpose: a database outage should show as an empty page, not
// as a pod the kubelet restarts in a loop.
export const dynamic = 'force-dynamic'

export const GET = () => Response.json({ status: 'ok' })
