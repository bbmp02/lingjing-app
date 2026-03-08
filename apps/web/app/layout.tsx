export const metadata = {
  title: '灵境 - 精神货币与关系自组织系统',
  description: '灵境APP - 下一代社交系统',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <nav style={{ padding: '1rem', background: '#333', color: '#fff' }}>
          <a href="/" style={{ color: '#fff', marginRight: '1rem' }}>首页</a>
          <a href="/users" style={{ color: '#fff', marginRight: '1rem' }}>用户</a>
          <a href="/spirit" style={{ color: '#fff', marginRight: '1rem' }}>货币</a>
          <a href="/relationships" style={{ color: '#fff' }}>关系</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
