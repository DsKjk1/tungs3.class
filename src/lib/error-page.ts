export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>500 — TUNG³ archive offline</title>
    <style>
      body {
        margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
        background: #000; color: #e6f1ff; font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
      }
      .box { border: 1px solid #4aa3ff; padding: 24px 28px; box-shadow: 0 0 24px rgba(74,163,255,0.35); text-align: center; max-width: 420px; }
      h1 { color: #4aa3ff; margin: 0 0 6px; font-size: 28px; }
      a { color: #4aa3ff; }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>SEGFAULT 500</h1>
      <p>// the archive is temporarily unreachable</p>
      <p><a href="/">▸ retry connection</a></p>
    </div>
  </body>
</html>`;
}
