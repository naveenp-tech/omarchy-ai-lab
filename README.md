# Naveen // Engineering Lab

Stage 1 of the portfolio roadmap: a hand-written, dependency-free frontend
(HTML + CSS + JavaScript), served by Nginx in a Docker container.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `styles.css` | Dark, terminal-inspired responsive design |
| `script.js` | Terminal typing effect, footer year, contact links |

## Run it locally without Docker

```bash
cd ~/omarchy-ai-lab
python3 -m http.server 8099
# open http://localhost:8099
```

## Serve it with Nginx in Docker

Stop and remove the container that is serving the default nginx page, then
re-create it with this folder bind-mounted (read-only) into the container:

```bash
cd ~/omarchy-ai-lab

sudo docker stop my-website
sudo docker rm my-website

sudo docker run -d \
  --name my-website \
  -p 8080:80 \
  -v "$PWD":/usr/share/nginx/html:ro \
  nginx
```

Open <http://localhost:8080>.

Because the mount is live, any edit you make to the files on the host is
visible after a browser refresh — no rebuild, no restart.

## Customise

1. Edit `siteConfig` at the top of `script.js` to change the two email addresses.
2. Add new project cards in `index.html` as you finish projects.
3. Keep content honest: no fabricated metrics, fake users or invented projects.

## Contact details

- Public: `naveen.punnam@epita.fr` (shown on the site)
- The personal address is kept private and is not stored in this repository.

No GitHub account yet — add one to the contact list and the skills section when
it exists, not before.

## Next stages

1. **Done** — HTML/CSS/JS portfolio
2. **Done** — containerised with Docker + Nginx
3. JavaScript interactivity and a live project dashboard
4. Python + FastAPI backend, PostgreSQL
5. GitHub Actions deployment
6. AI assistant integration
7. Monitoring and security hardening
