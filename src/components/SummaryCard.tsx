export default function SummaryCard({ value, label }: { value: string; label: string }) {
  return <div className="summary-card"><b>{value}</b><span>{label}</span></div>
}
