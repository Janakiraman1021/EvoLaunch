// GovernancePanel component
import type { FC } from 'react';

export interface GovernancePanelProps {
  agent?: {
    id?: string;
    [key: string]: unknown;
  };
}

const GovernancePanel: FC<GovernancePanelProps> = ({ agent }) => {
  return <div>Governance Panel (to be implemented){agent?.id ? ` for ${agent.id}` : ''}</div>;
};

export default GovernancePanel;
