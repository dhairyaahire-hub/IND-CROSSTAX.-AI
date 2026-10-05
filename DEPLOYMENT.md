# Custom Domain & Hosting Guide: crosstax.ai

This guide covers how to deploy **Cross Tax AI** and connect your custom domain (`crosstax.ai` and `www.crosstax.ai`).

---

## Architecture Overview
- **Frontend**: React 19 + Tailwind CSS (bundled to `/dist`)
- **Backend API**: Node.js + Express (bundled to `server.js`)
- **Port**: `3000` (configurable via `PORT` environment variable)
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio.
  - `NODE_ENV`: `production`
  - `PORT`: `3000` (or host-assigned)

---

## Option 1: Google Cloud Run (Recommended — Zero Maintenance)
Cloud Run is the fastest, auto-scaling, serverless platform (and where your current preview runs).

### Step 1: Deploy to Cloud Run
Using Google Cloud CLI:
```bash
# 1. Build and submit container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/crosstax-ai

# 2. Deploy to Cloud Run
gcloud run deploy crosstax-ai \
  --image gcr.io/YOUR_PROJECT_ID/crosstax-ai \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_gemini_key_here,NODE_ENV=production
```

### Step 2: Map Custom Domain (`crosstax.ai`)
1. In the Google Cloud Console, navigate to **Cloud Run** &rarr; **Manage Custom Domains**.
2. Click **Add Mapping**.
3. Select your service: `crosstax-ai`.
4. Enter your verified domain: `crosstax.ai` and `www.crosstax.ai`.
5. Cloud Run will provide the exact DNS records to enter into your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - **Type `A`**: `@` &rarr; `216.239.32.21`, `216.239.34.21`, `216.239.36.21`, `216.239.38.21`
   - **Type `AAAA`**: `@` &rarr; IPv6 addresses provided by Google
   - **Type `CNAME`**: `www` &rarr; `ghs.googlehosted.com`
6. Google automatically provisions and renews free SSL/TLS certificates.

---

## Option 2: Render.com / Railway / Fly.io (1-Click Git Deploy)

### On Render.com:
1. Connect your GitHub / GitLab repository.
2. Select **Web Service** &rarr; **Docker** (or Node runtime).
   - If using Node environment:
     - Build Command: `npm install && npm run build`
     - Start Command: `node server.js`
3. Add Environment Variable:
   - `GEMINI_API_KEY`: `your_key`
4. Go to **Settings** &rarr; **Custom Domains**.
5. Add `crosstax.ai` and `www.crosstax.ai`.
6. Add the DNS records shown by Render at your domain registrar:
   - `A Record`: `@` &rarr; Render IP (e.g. `216.24.57.1`)
   - `CNAME Record`: `www` &rarr; `your-service.onrender.com`

---

## Option 3: VPS / DigitalOcean / AWS EC2 with Docker

If running on an Ubuntu VPS:

```bash
# 1. Clone your repository
git clone <your-repo-url>
cd <repo>

# 2. Build the Docker image
docker build -t crosstax-ai .

# 3. Run the container
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key" \
  -e NODE_ENV="production" \
  --name crosstax \
  --restart always \
  crosstax-ai
```

### Nginx Reverse Proxy & Free Let's Encrypt SSL:
`/etc/nginx/sites-available/crosstax.ai`:
```nginx
server {
    server_name crosstax.ai www.crosstax.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable SSL:
```bash
sudo certbot --nginx -d crosstax.ai -d www.crosstax.ai
```

---

## DNS Settings Checklist for `crosstax.ai`
At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

| Record Type | Host / Name | Value / Destination | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | Host IP address (from Cloud Run, Render, or VPS) | Auto / 300 |
| **CNAME** | `www` | `crosstax.ai` (or host CNAME) | Auto / 300 |

Once DNS propagates (usually 5–30 minutes), `https://crosstax.ai` will be live with full SSL encryption!
