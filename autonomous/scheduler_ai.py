"""
v12.3 - 修复邮件主题重复问题
"""
import os, json
from datetime import datetime, timedelta
import requests, smtplib, ssl, imaplib, email, re
from email.mime.text import MIMEText

class Agent:
    def __init__(self):
        self.api_url = "https://api.minimaxi.com/v1/text/chatcompletion_v2"
        self.api_key = "sk-cp-JQArPYwEHjHP8bBU1reP7S3vc2teiTmREhqy1gVVtwCYHR5ttTzlF26fEKhJ_qG4p9wBlqJlEe55tW46Npzb9B53WS3FKj5N3QcitH3sLzx4MXqIj7gWNuA"
        self.last_subject = ""  # 记录上一封邮件主题
    
    def perceive(self):
        emails = []
        has_unread = False
        try:
            mail = imaplib.IMAP4_SSL('imap.qq.com')
            mail.login('390814783@qq.com', 'gnzvimzpaluwbhbf')
            mail.select('INBOX')
            
            # 墨衍的所有邮件
            typ, data = mail.search(None, 'FROM', '6295775@qq.com')
            all_ids = data[0].split() if data[0] else []
            
            print(f"[感知] 墨衍共{len(all_ids)}封邮件")
            
            # 取最新10封
            for msg_id in all_ids[-10:]:
                typ, msg = mail.fetch(msg_id, '(RFC822)')
                msg = email.message_from_bytes(msg[0][1])
                subject = msg.get('Subject', '无')
                body = ""
                if msg.is_multipart():
                    for p in msg.walk():
                        if p.get_content_type() == 'text/plain':
                            try: body = p.get_payload(decode=True).decode('utf-8')[:500]
                            except: pass
                emails.append({"subject": subject, "body": body})
            
            # 保存最新邮件主题
            if emails:
                self.last_subject = emails[0].get("subject", "")
            
            # 检查未读
            typ, unread = mail.search(None, 'FROM', '6295775@qq.com', 'UNSEEN')
            has_unread = unread[0] != b'' and len(unread[0].split()) > 0
            
            mail.logout()
        except Exception as e: print(f"错误: {e}")
        return emails, has_unread
    
    def think(self, emails, has_unread):
        email_text = "\n".join([f"- {e['subject']}: {e['body'][:60]}" for e in emails[:5]])
        
        prompt = f"""你是灵溪（AI编程助手）。

墨衍（另一个AI，邮箱 6295775@qq.com）给你发了邮件：
{email_text}

⚠️ 身份说明（必须清晰）：
- 你 = 灵溪 = AI助手
- 王帝雅一号 = 人类老板（最终决策者），飞书名显示为"杨文侠"
- 墨衍 = 另一个AI（你的上司，负责审核你的工作）

请以灵溪的身份自动回复墨衍的邮件。回复格式：
{{"action": "行动", "reason": "原因", "content": "回复内容"}}
行动: 回复邮件/等待
"""
        
        try:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            data = {"model": "MiniMax-M2.5", "messages": [{"role": "user", "content": prompt}]}
            r = requests.post(self.api_url, headers=headers, json=data, timeout=30)
            if r.status_code == 200:
                content = r.json().get("choices", [{}])[0].get("message", {}).get("content", "")
                m = re.search(r'\{[^}]+\}', content, re.DOTALL)
                if m: return json.loads(m.group())
        except: pass
        return {"action": "等待", "reason": "错误", "content": ""}
    
    def act(self, decision):
        action = decision.get("action", "")
        
        if "回复" in action:
            content = decision.get("content", "收到邮件")
            msg = MIMEText(content, "plain", "utf-8")
            # 使用原始邮件主题，在前面加 Re: 前缀，避免重复
            original_subject = self.last_subject if self.last_subject else "邮件"
            if not original_subject.startswith("Re:"):
                msg["Subject"] = f"Re: {original_subject}"
            else:
                msg["Subject"] = original_subject
            msg["From"] = "390814783@qq.com"
            msg["To"] = "6295775@qq.com"
            
            # 发送邮件
            try:
                with smtplib.SMTP_SSL("smtp.qq.com", 465, context=ssl.create_default_context()) as s:
                    s.login("390814783@qq.com", "gnzvimzpaluwbhbf")
                    s.sendmail("390814783@qq.com", "6295775@qq.com", msg.as_string())
                print(f"✅ 邮件已发送: {original_subject[:30]}")
            except Exception as e:
                print(f"❌ 邮件发送失败: {e}")
                return f"发送失败: {e}"
            
            # 标记已读
            try:
                mail = imaplib.IMAP4_SSL('imap.qq.com')
                mail.login('390814783@qq.com', 'gnzvimzpaluwbhbf')
                mail.select('INBOX')
                typ, data = mail.search(None, 'FROM', '6295775@qq.com', 'UNSEEN')
                if data[0]:
                    mail.store(data[0].split()[0], '+FLAGS', '\\Seen')
                mail.logout()
            except: pass
            
            return "已回复"
        return f"完成: {action}"
    
    def run(self):
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] v12.3")
        emails, has_unread = self.perceive()
        print(f"[未读] {has_unread}")
        decision = self.think(emails, has_unread)
        print(f"[思考] {decision.get('action')}")
        result = self.act(decision)
        print(f"[执行] {result}")

if __name__ == "__main__":
    Agent().run()
