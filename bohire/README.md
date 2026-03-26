# BoHire

**Proof of work, not just claims.**

BoHire is a candidate verification platform that lets job candidates build verified professional profiles. Built on the Bolospot protocol, it combines World ID verification, real GitHub analysis, and AI-generated resumes to create authentic, trustworthy developer profiles.

## What Makes BoHire Different

- **World ID Verification** — Proves you are a real, unique human. No fake profiles, no bot farms.
- **AI GitHub Analysis** — Claude AI analyzes your ACTUAL repos and commits. No self-reported fluff.
- **LinkedIn Integration** — Import real work history via OAuth (optional)
- **AI-Generated Resume** — Claude reads your code and writes an honest resume based on what you actually built
- **Bolospot Permission Layer** — Employers request a 'bohire bolo' to view profiles. Candidates control access and can revoke instantly.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** World ID (@worldcoin/minikit-js)
- **Permission Layer:** Bolospot Protocol
- **AI:** Anthropic Claude (via @anthropic-ai/sdk)
- **Code Analysis:** GitHub REST API
- **Theme:** Dark glassmorphism (bg: #08090d, green: #27d558, teal: #14b8a6)

## Features

### Pages

1. **/** — Landing page with hero and feature showcase
2. **/onboard** — Multi-step onboarding flow:
   - World ID verification
   - GitHub connection
   - LinkedIn import (optional)
   - AI code assessment
3. **/profile** — Candidate dashboard:
   - Verified badge
   - GitHub stats
   - AI-generated resume
   - Active grants management
   - Pending access requests
   - Revoke access buttons
4. **/request/[handle]** — Employer sends bolo request to candidate

### API Routes

- `POST /api/worldid/verify` — Verify World ID proof (dev/demo mode fallback)
- `GET /api/github/repos` — Fetch candidate repos via GitHub API
- `POST /api/ai/assess` — Claude analyzes repos and generates assessment
- `POST /api/ai/resume` — Claude generates resume from GitHub + LinkedIn data
- `POST /api/bolo/request` — Send bolo request via Bolospot SDK
- `GET /api/bolo/grants` — List active grants
- `GET /api/bolo/pending` — Get pending access requests
- `POST /api/bolo/approve` — Approve a pending request
- `POST /api/bolo/revoke` — Revoke an active grant

## Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Anthropic API key
- GitHub OAuth app credentials
- World ID app credentials
- Bolospot API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bohire.git
cd bohire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_WORLD_APP_ID=your_world_app_id
NEXT_PUBLIC_WORLD_ACTION=verify-candidate
BOLO_API_KEY=your_bolo_api_key
BOLO_API_URL=https://api.bolospot.com
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude AI | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret | Yes |
| `NEXT_PUBLIC_WORLD_APP_ID` | World ID app ID from Worldcoin | Yes |
| `NEXT_PUBLIC_WORLD_ACTION` | World ID action name | Yes |
| `BOLO_API_KEY` | Bolospot protocol API key | Yes |
| `BOLO_API_URL` | Bolospot API endpoint | Yes |

## Development

### Project Structure

```
bohire/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── onboard/         # Onboarding flow
│   ├── profile/         # Candidate dashboard
│   ├── request/         # Employer request page
│   └── page.tsx         # Landing page
├── components/          # React components
│   └── layout/          # Layout components
├── lib/                 # Utilities and types
│   ├── bolospot.ts      # Bolospot SDK wrapper
│   └── types.ts         # TypeScript type definitions
└── public/              # Static assets
```

### Key Technologies

- **World ID:** Proof of personhood verification
- **Claude AI:** Code analysis and resume generation
- **Bolospot Protocol:** Permission-based access control
- **GitHub API:** Repository data and OAuth

## How It Works

1. **Candidate Onboarding:**
   - Verify identity with World ID
   - Connect GitHub account
   - (Optional) Import LinkedIn profile
   - AI analyzes code and generates assessment + resume

2. **Employer Access:**
   - Visit `/request/[candidate-handle]`
   - Submit access request (bolo)
   - Candidate receives notification

3. **Access Control:**
   - Candidate reviews pending requests in dashboard
   - Approve/deny with one click
   - Revoke access anytime from active grants list

## Deployment

Build the production app:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

Deploy to Vercel:
```bash
vercel deploy
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a PR.

---

**Proof of work, not just claims.**
