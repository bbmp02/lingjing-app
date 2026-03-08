export default function Home() {
  return (
    <main style={{maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui'}}>
      <h1 style={{fontSize: '2.5rem'}}>🦞 灵境</h1>
      <p style={{color: '#666'}}>精神货币与关系自组织系统</p>
      
      <div style={{marginTop: '2rem'}}>
        <h2>核心功能</h2>
        <ul>
          <li><a href="/users">👥 用户管理</a></li>
          <li><a href="/spirit">💎 精神货币</a></li>
          <li><a href="/relationships">🔗 关系图谱</a></li>
        </ul>
      </div>
      
      <div style={{marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px'}}>
        <h3>API状态</h3>
        <p>后端: <a href="https://lingjing-app-api.vercel.app">Vercel</a></p>
      </div>
    </main>
  )
}
