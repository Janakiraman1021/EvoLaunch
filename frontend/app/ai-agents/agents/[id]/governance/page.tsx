import GovernancePanel from '../../../../../components/agents/GovernancePanel';
import { mockAgents } from '../../../../../components/agents/mockData';

export default function AgentGovernance({ params }: { params: { id: string } }) {
  // Mock proposals and agent data
  const agent = mockAgents.find(a => a.id === params.id);
  return (
    <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Governance</h1>
      <GovernancePanel agent={agent} />
    </div>
  );
}
