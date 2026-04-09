export default function Home() {
  return (
    <>
      <header>
        <div className="logo">Test LP</div>
        <nav>
          <a href="#features">特徴</a>
          <a href="#about">概要</a>
          <a href="#contact">お問い合わせ</a>
        </nav>
      </header>

      <section className="hero">
        <h1>あなたのビジネスを加速する</h1>
        <p>シンプルで使いやすいサービスを提供します</p>
        <a href="#contact" className="btn">お問い合わせ</a>
      </section>

      <section className="features" id="features">
        <h2>特徴</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">&#9889;</div>
            <h3>高速</h3>
            <p>圧倒的なスピードでビジネスの課題を解決します。</p>
          </div>
          <div className="feature-card">
            <div className="icon">&#128274;</div>
            <h3>安全</h3>
            <p>万全のセキュリティ対策で安心してご利用いただけます。</p>
          </div>
          <div className="feature-card">
            <div className="icon">&#128640;</div>
            <h3>簡単</h3>
            <p>直感的な操作で誰でもすぐに使い始められます。</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>概要</h2>
        <p>私たちはお客様のビジネスを成功に導くために、最高品質のサービスを提供しています。チーム一丸となって、お客様の期待を超える体験をお届けします。</p>
      </section>

      <section className="contact" id="contact">
        <h2>お問い合わせ</h2>
        <form>
          <label htmlFor="name">お名前</label>
          <input type="text" id="name" placeholder="山田 太郎" />

          <label htmlFor="email">メールアドレス</label>
          <input type="email" id="email" placeholder="example@mail.com" />

          <label htmlFor="message">メッセージ</label>
          <textarea id="message" placeholder="お気軽にご連絡ください"></textarea>

          <button type="submit">送信する</button>
        </form>
      </section>

      <footer>
        &copy; 2026 Test LP. All rights reserved.
      </footer>
    </>
  );
}
