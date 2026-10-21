# PayPal MCP with Capstan

Capstan executes payments through **PayPal REST + Orders checkout** in the app. **[PayPal MCP](https://developer.paypal.com/ai-tools/mcp-server)** is the complementary path: operators and developers use natural language in **Cursor**, Claude, or another MCP client to inspect invoices, orders, and other PayPal sandbox data while Capstan enforces policy in the product UI.

This satisfies hackathon interest in **PayPal AI tooling** without duplicating checkout inside the chat client.

## 1. Sandbox access token

From repo root (uses `frontend/.env.local`):

```bash
node scripts/print-mcp-token.mjs
```

Copy the token output. It expires in about an hour; rerun the script when MCP calls start failing.

## 2. Cursor MCP config

Add to Cursor MCP settings (merge with your existing servers):

```json
{
  "mcpServers": {
    "paypal": {
      "command": "npx",
      "args": ["-y", "@paypal/mcp", "--tools=all"],
      "env": {
        "PAYPAL_ACCESS_TOKEN": "PASTE_TOKEN_FROM_SCRIPT",
        "PAYPAL_ENVIRONMENT": "SANDBOX"
      }
    }
  }
}
```

Restart Cursor after saving.

## 3. Try it

In Cursor chat, after Capstan captures an order in the console, ask:

- “List recent PayPal sandbox transactions” or tasks supported by `@paypal/mcp`.

Compare MCP results with the **Order ID** and **Capture ID** columns in **Dashboard**.

## 4. Remote MCP (optional)

PayPal also hosts sandbox MCP at `https://mcp.sandbox.paypal.com` with OAuth. See [PayPal MCP quickstart](https://developer.paypal.com/ai-tools/mcp-server) for remote setup.

## Security

Never commit access tokens. The print script reads local `.env.local` only; tokens are short lived.
