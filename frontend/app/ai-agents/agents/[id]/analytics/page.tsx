
import PerformanceChart from '../../../../../../components/agents/PerformanceChart';
import { mockPerformanceData } from '../../../../../../components/agents/mockData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const COLORS = ['#E6C07B', '#A1A1AA', '#15803D', '#DC2626'];

export default function AgentAnalytics({ params }: { params: { id: string } }) {
  // All data is static/mock
  return (
    <div className="max-w-5xl mx-auto p-8 bg-card rounded-lg shadow grid gap-8">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-secondary p-4 rounded-lg">
          <div className="font-semibold mb-2">Volatility Chart</div>
          <PerformanceChart data={mockPerformanceData.volatility} type="line" />
        </div>
        <div className="bg-secondary p-4 rounded-lg">
          <div className="font-semibold mb-2">Risk-Return Scatter</div>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <XAxis dataKey="risk" name="Risk" />
              <YAxis dataKey="return" name="Return" />
              <ZAxis dataKey="size" range={[60, 400]} name="Size" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={mockPerformanceData.riskReturn} fill="#E6C07B" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-secondary p-4 rounded-lg">
          <div className="font-semibold mb-2">Capital Deployment</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={mockPerformanceData.capitalDeployment} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {mockPerformanceData.capitalDeployment.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-secondary p-4 rounded-lg">
          <div className="font-semibold mb-2">Strategy Frequency</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockPerformanceData.strategyFrequency}>
              <XAxis dataKey="strategy" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#E6C07B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
