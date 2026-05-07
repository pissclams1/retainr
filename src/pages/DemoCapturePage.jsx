import DemoAnimation from '../components/DemoAnimation'

export default function DemoCapturePage() {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#f8f9fc',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <DemoAnimation />
    </div>
  )
}
