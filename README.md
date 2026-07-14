# Ad Agency Tool

A single-page web application that helps an advertising agency track client
work and team workload. Built as a DevOps reference project: the app itself
is a small React frontend, and the repository ships a build → scan → publish
workflow, with Kubernetes deployment manifests, backed by GitHub Actions.

---

## Project overview

The application models an agency workflow around two concepts:

- **Clients** — engagement accounts (e.g. *Japasya*, *Samaya*, *Dorpo*) that
  own work items.
- **Team** — agency members (designers, producers, strategists) who are
  assigned work.

Work items are represented as **cards** that carry:

- Title and description
- Emoji icon
- Assignee (a team member)
- Priority (`low`, `medium`, `high`)
- Due date (with overdue highlighting)
- Comma-separated labels
- Checklist progress (completed / total)
- Comment and attachment counts

The UI has two top-level views:

- **Clients view** — one column per client listing all cards belonging to
  that client, with a per-client *Add Work* action.
- **Team view** — one card per team member listing everything assigned to
  them, with a form to add new members.

A search box filters cards by title and a priority dropdown filters by
priority. Cards open into a detail modal (view / edit / duplicate / delete)
and a dedicated edit modal. All state is held in component memory — there is
no backend, database, or persistence layer; this repository is intentionally
focused on the front end and its delivery pipeline.

---

## Technology stack

| Layer        | Choice                                  |
| ------------ | --------------------------------------- |
| Framework    | React 19                                |
| Build tool   | Vite 8                                  |
| Styling      | Tailwind CSS 4 (via `@tailwindcss/vite`)|
| Icons        | `lucide-react`                          |
| Linter       | Oxlint                                  |
| Runtime      | Node.js 22                              |
| Container    | Multi-stage Docker (Node → Nginx)       |
| Orchestrator | Kubernetes (Deployment, Service, Namespace) |
| Registry     | GitHub Container Registry (GHCR)        |
| Security     | Trivy image scan                        |
| CI           | GitHub Actions                          |

---

## Local development setup

Prerequisites: Node.js 22 and npm.

```bash
# install dependencies
npm ci

# start the dev server (Vite, with HMR)
npm run dev

# run the linter (Oxlint)
npm run lint

# produce a production build into dist/
npm run build

# preview the production build locally
npm run preview
```

The Vite dev server defaults to `http://localhost:5173`. The production
build emits static assets into `dist/`, which is what the container image
serves.

---

## Container build

The repository ships a multi-stage `Dockerfile`:

1. **Builder stage** — `node:22-alpine`, runs `npm ci` and `npm run build`
   to produce the static assets in `dist/`.
2. **Runtime stage** — `nginx:alpine`, copies the built assets from the
   builder into `/usr/share/nginx/html`, applies `apk upgrade --no-cache`
   to refresh the base image's packages, and starts Nginx in the
   foreground. Port `80` is exposed.

```bash
docker build -t ad-agency-tool:local .
docker run --rm -p 8080:80 ad-agency-tool:local
# open http://localhost:8080
```

---

## Kubernetes deployment

Manifests live in `k8s/` and are cluster-agnostic. They have been exercised
against a local [kind](https://kind.sigs.k8s.io/) cluster, which is a
convenient way to run a real Kubernetes control plane on a developer
machine.

### Apply

```bash
# create the namespace
kubectl apply -f k8s/namespace.yaml

# deploy the application and its service
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# verify
kubectl -n ad-agency get pods,svc,deploy
```

### Workload characteristics

- **Namespace** — `ad-agency` (isolates the workload from `default`).
- **Deployment** — `ad-agency-tool`, **3 replicas** for availability.
- **Strategy** — `RollingUpdate` with `maxSurge: 1` and `maxUnavailable: 1`,
  so updates roll out one pod at a time without dropping below two healthy
  replicas.
- **Service** — `ClusterIP` on port `80` (the cluster-internal default),
  selecting pods with label `app: ad-agency-tool`.
- **Probes** — both probes hit `GET /` on port `80`:
  - `readinessProbe` — `initialDelaySeconds: 5`, `periodSeconds: 10`.
  - `livenessProbe` — `initialDelaySeconds: 15`, `periodSeconds: 20`.
- **Resources** — resource requests support scheduling decisions, while
  limits constrain container CPU and memory usage:
  - requests: `cpu: 50m`, `memory: 64Mi`
  - limits:   `cpu: 200m`, `memory: 128Mi`
- **Image** — pinned by Git SHA to provide a uniquely versioned and traceable reference:
  `ghcr.io/manishgantyala/ad-agency-tool:<git-sha>`.

### Experiments performed

The manifest set was validated end-to-end against a local kind cluster.
The following Kubernetes behaviours were observed and verified:

1. **Self-healing** — deleting a pod caused the Deployment to create a
   replacement pod and converge back to the configured replica count,
   confirming the Deployment controller's reconciliation behaviour.
2. **Manual scaling** — scaling the Deployment from two replicas to three
   created an additional pod and brought it to Ready.
3. **Rolling update** — updating the container image triggered Kubernetes
   to gradually replace the previous pods with pods running the new
   image. The current Deployment explicitly configures `maxSurge: 1` and
   `maxUnavailable: 1`.
4. **Rollback** — `kubectl -n ad-agency rollout undo deploy/ad-agency-tool`
   returned the Deployment to the previous ReplicaSet; the rolled-back
   pods passed readiness and the previous revision's pods were scaled
   back down, confirming that Kubernetes retained the prior ReplicaSet
   for exactly this purpose.

---

## CI pipeline (GitHub Actions)

Defined in `.github/workflows/ci.yml`. It triggers on every push and pull
request to `main`.

The pipeline runs the following stages, in order:

1. **Checkout source code** — `actions/checkout@v4`.
2. **Setup Node.js 22** — `actions/setup-node@v4` with npm caching.
3. **Install dependencies** — `npm ci`.
4. **Lint** — `npm run lint` (Oxlint).
5. **Production build** — `npm run build`; the workflow fails if the app
   cannot build cleanly.
6. **Docker image build** — `docker build -t ad-agency-tool:${{ github.sha }} .`
7. **Security gate — Trivy** — `aquasecurity/trivy-action@master` scans
   the built image with `severity: CRITICAL,HIGH` and
   `exit-code: 1`, so any HIGH or CRITICAL finding fails the build.
8. **GHCR login** — `docker/login-action@v3` against `ghcr.io` using the
   workflow's `GITHUB_TOKEN` (pushes to `main` only).
9. **Tag** — the locally built image is re-tagged with both
   `${{ github.sha }}` and `latest`.
10. **Push** — both tags are pushed to
    `ghcr.io/manishgantyala/ad-agency-tool`, so every commit produces a
    uniquely tagged image, while `latest` tracks the most recently
    published image from `main`.

Required permissions in the workflow: `contents: read`, `packages: write`.

### Connecting CI to the cluster

The Kubernetes manifests are not applied from CI; deployment is performed
manually against the local kind cluster by updating the pinned image
tag in `k8s/deployment.yaml` to the SHA of the desired build and
re-applying with `kubectl`. Using the full Git SHA as the image tag
provides a unique, traceable reference from the deployed image back to
the source commit.

---

## Repository layout

```
.
├── src/                     React application source
│   ├── AdAgencyTool.jsx     Main UI component (clients + team views)
│   ├── App.jsx              App entry
│   ├── main.jsx             React root
│   ├── App.css, index.css   Styles
│   └── assets/              Bundled assets
├── public/                  Static assets served as-is
├── k8s/                     Kubernetes manifests
│   ├── namespace.yaml       Namespace: ad-agency
│   ├── deployment.yaml      Deployment, 3 replicas, probes, resources
│   └── service.yaml         ClusterIP Service on port 80
├── .github/workflows/ci.yml CI pipeline
├── Dockerfile               Multi-stage Node → Nginx build
├── vite.config.js           Vite + React + Tailwind plugin wiring
├── .oxlintrc.json           Oxlint configuration
└── package.json             Scripts and dependencies
```
