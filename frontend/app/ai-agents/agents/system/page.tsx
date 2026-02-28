
import SystemStatusCard from '../../../../../components/agents/SystemStatusCard';
import { mockSystemStatus } from '../../../../../components/agents/mockData';

export default function AgentsSystem() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-card rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">System Health Dashboard</h1>
      <SystemStatusCard status={mockSystemStatus} />
    </div>
  );
}
