# Telegram Watchdog Serverless

**[Telegram Watchdog](https://github.com/tg-watchdog/tg-watchdog) but serverless, with guard bot support.**

---

_Telegram Watchdog_ is a Telegram bot used for anti-abuse from Telegram group chats.

- Use the guard bot function instead of sending verify request messages in group chats.
- Use CAPTCHA and web app, complete verification in just clicks.
- Privacy first - no data will be saved or shared.
- Self-deployment supported.

## How to use

- Set bot as admin and enable the "Process join requests" permission
- Enable new member approval in group chats
- That’s it! Share your group, and Telegram Watchdog will work for you when you have new candidates

## Differences with the original

- Automatically cleaning up unapproved join requests in group chats
- [Guard bot](https://telegram.org/blog/watch-apps-and-more#guardian-bots-for-group-chats) support
- Runs on [Telegram Serverless](https://core.telegram.org/bots/serverless)

## Deployment

Install dependencies and login to tgcloud.

```bash
npm install
npx tgcloud login
```

Configure the necessary environment variables.

```bash
# Cloudflare Turnstile site key
VITE_SITEKEY=
# JWT secret for signing tokens
TSDOWN_JWT_SECRET=a-string-secret-at-least-256-bits-long
# Cloudflare Turnstile secret key
TSDOWN_API_KEY=
# Serverless base url
TSDOWN_BASE_URL=https://appXXXXXXXXXX.tgcloud.ai
# Username of your bot
TSDOWN_BOT_USERNAME=YourBotUsername
```

Deploy to serverless.

```bash
npm run deploy
```
