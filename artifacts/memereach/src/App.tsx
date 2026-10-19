import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Check,
  Code2,
  Command,
  Layers3,
  Menu,
  Plus,
  Radio,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';

type LocalCampaign = {
  id: string;
  name: string;
  createdAt: string;
  status: 'Draft' | 'Planning';
};

const STORAGE_KEY = 'memereach-demo-campaigns-v1';
const queryClient = new QueryClient();
const samplePrompt =
  'Create a bold launch concept for an on-chain art marketplace on Solana. Keep it playful, technically sharp, and recognizable in a fast-moving feed.';

const faqs = [
  {
    question: 'What is MemeReach?',
    answer:
      'MemeReach is a creative and campaign workspace designed for teams building on Solana. It brings campaign thinking, creative direction, and project organization into one focused place.',
  },
  {
    question: 'Does MemeReach launch campaigns on-chain?',
    answer:
      'No. The current experience is a product preview. Campaign launch and any on-chain operations require a separately configured backend, provider integrations, and a verified Solana program. This site does not submit transactions.',
  },
  {
    question: 'Is the AI creative generator live?',
    answer:
      'The interactive preview below produces clearly labeled sample copy in your browser. Actual AI image and video generation requires an AI provider and backend setup; no generation request is sent from this demo.',
  },
  {
    question: 'Can I connect my Solana wallet here?',
    answer:
      'Wallet connection is not enabled in this marketing preview. A production integration should use the supported Solana Wallet Adapter and request only the permissions needed for a clear user action—never a seed phrase or a signature just to connect.',
  },
  {
    question: 'Where is demo project data stored?',
    answer:
      'Projects created in the interactive demo are local sample records, saved in this browser with localStorage. They are not synced to an account, shared with a team, or visible on-chain.',
  },
];

function getSavedCampaigns(): LocalCampaign[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalCampaign[]) : [];
  } catch {
    return [];
  }
}

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [prompt, setPrompt] = useState('');
  const [concept, setConcept] = useState('');
  const [campaigns, setCampaigns] = useState<LocalCampaign[]>(getSavedCampaigns);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch {
      // Local demo remains usable for this session if browser storage is unavailable.
    }
  }, [campaigns]);

  const makeConcept = () => {
    const brief = prompt.trim() || samplePrompt;
    const project = brief.match(/for (?:an? )?([^,.]+)/i)?.[1] ?? 'your Solana project';
    setConcept(
      `SIMULATED CONCEPT — “${project}”: lead with a single, instantly legible visual cue; pair it with a concise launch line and a builder-minded proof point. Keep the tone curious, never promise outcomes. Brief: ${brief}`,
    );
  };

  const createCampaign = () => {
    const trimmedPrompt = prompt.trim();
    const extracted = trimmedPrompt.match(/for (?:an? )?([^,.]+)/i)?.[1];
    const campaign: LocalCampaign = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      name: extracted ? extracted.replace(/^the /i, '') : 'Solana launch concept',
      createdAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      status: 'Draft',
    };
    setCampaigns((current) => [campaign, ...current]);
    setConcept('LOCAL DEMO PROJECT CREATED — Saved in this browser only. It is not connected to an account, provider, or Solana program.');
  };

  const changeStatus = (id: string) => {
    setCampaigns((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: item.status === 'Draft' ? 'Planning' : 'Draft' } : item,
      ),
    );
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="MemeReach home" data-testid="link-brand-home" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>Meme<em>Reach</em></span>
          </a>
          <div className={`nav-links${menuOpen ? ' open' : ''}`} id="main-navigation">
            <a href="#platform" data-testid="link-nav-platform" onClick={closeMenu}>Platform</a>
            <a href="#how-it-works" data-testid="link-nav-how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#pricing" data-testid="link-nav-pricing" onClick={closeMenu}>Pricing</a>
            <a href="#faq" data-testid="link-nav-faq" onClick={closeMenu}>FAQ</a>
          </div>
          <div className="nav-actions">
            <a className="text-link" href="#demo" data-testid="link-nav-preview">Preview workspace</a>
            <button className="button button-primary" onClick={scrollToDemo} data-testid="button-nav-start">
              Explore the preview <ArrowRight size={14} aria-hidden="true" />
            </button>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen((value) => !value)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow">The Solana growth workspace</div>
              <h1 className="display">Make your next <span className="gradient">Solana launch</span> impossible to ignore.</h1>
              <p className="hero-lede">
                A creative and campaign workspace for teams building on Solana. Shape the idea, organize the work, and get launch-ready—without losing the plot.
              </p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={scrollToDemo} data-testid="button-hero-build">
                  Try the workspace <ArrowRight size={15} aria-hidden="true" />
                </button>
                <a className="button button-quiet" href="#how-it-works" data-testid="link-hero-how">
                  See how it works <ArrowDownRight size={15} aria-hidden="true" />
                </a>
              </div>
              <div className="hero-meta">
                <span className="sol-dot" />
                Solana-only by design <span aria-hidden="true">/</span> Built for the people shipping
              </div>
            </div>
            <div className="visual-stage" aria-label="Abstract Solana-inspired luminous emerald prism illustration" role="img" data-testid="visual-solana-prism">
              <div className="orbit-ring" />
              <div className="orbit" />
              <div className="solana-prism">
                <div className="prism-glow" />
                <div className="prism-face">
                  <i className="prism-line" /><i className="prism-line" /><i className="prism-line" />
                  <div className="prism-edge" />
                </div>
              </div>
              <div className="visual-chip chip-one">
                <span className="chip-icon"><Sparkles size={15} /></span>
                <span><strong>Creative direction</strong><small>From brief to concept</small></span>
              </div>
              <div className="visual-chip chip-two">
                <span className="chip-icon"><Blocks size={15} /></span>
                <span><strong>Solana-native focus</strong><small>One ecosystem. One workspace.</small></span>
              </div>
              <span className="orbital-label">Creative systems / 01</span>
            </div>
          </div>
        </section>

        <div className="trust-strip">
          <div className="container trust-content">
            <span>Made for a new generation of on-chain builders</span>
            <div className="trust-items">
              <span><BadgeCheck size={14} /> Solana-first</span>
              <span><Code2 size={14} /> Builder-friendly</span>
              <span><ShieldCheck size={14} /> Clear by design</span>
            </div>
          </div>
        </div>

        <section className="section" id="platform">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">One connected workflow</div>
              <h2 className="section-title">The whole launch, <span className="gradient">in focus.</span></h2>
              <p className="section-subtitle">Turn scattered growth tasks into a clear operating rhythm—from the first spark of a concept to a campaign plan your team can actually use.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card main">
                <div className="feature-top"><span className="feature-index">01 / CREATIVE SYSTEMS</span><span className="feature-icon"><WandSparkles size={18} /></span></div>
                <h3>Start with a brief. Find the signal.</h3>
                <p>Give a direction to your creative—audience, tone, and the thing only your project can say. Build campaign concepts around your real product, not another copy-paste crypto template.</p>
                <div className="feature-aside" aria-hidden="true">
                  <div className="prompt-surface"><strong>Brief / Solana-native art marketplace</strong><br />A distinct visual world. Human language. A launch idea worth remembering.</div>
                  <span className="prompt-tag">Concept system · draft 01</span>
                  <div className="mini-art" />
                </div>
              </article>
              <article className="feature-card feature-compact">
                <div className="feature-top"><span className="feature-index">02 / PROJECT SPACE</span><span className="feature-icon"><Layers3 size={18} /></span></div>
                <h3>Keep every project together.</h3>
                <p>Keep campaign notes, creative direction, and next steps close to the project they belong to.</p>
                <div className="workspace-mini" aria-hidden="true">
                  <div className="workspace-project"><span className="project-swatch" /><span><b>Solana art market</b><small>LOCAL PREVIEW PROJECT</small></span></div>
                  <span className="status-pill">Draft</span>
                </div>
              </article>
              <article className="feature-card feature-compact">
                <div className="feature-top"><span className="feature-index">03 / CAMPAIGN FLOW</span><span className="feature-icon"><Radio size={18} /></span></div>
                <h3>Move from idea to ready.</h3>
                <p>Organize a thoughtful campaign plan and see what needs attention before launch.</p>
                <div className="mini-timeline" aria-hidden="true">
                  <span className="timeline-step"><i className="timeline-dot" />Brief</span><i className="timeline-line" />
                  <span className="timeline-step"><i className="timeline-dot" />Creative</span><i className="timeline-line" />
                  <span className="timeline-step"><i className="timeline-dot" />Plan</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section steps-section" id="how-it-works">
          <div className="container">
            <div className="section-header">
              <div className="eyebrow">A more intentional workflow</div>
              <h2 className="section-title">From “what if” to <span className="gradient">what’s next.</span></h2>
              <p className="section-subtitle">A focused path for Solana teams to clarify their story and give their next campaign a real shape.</p>
            </div>
            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">STEP 01 / BRIEF</span><ArrowRight className="step-arrow" size={16} />
                <h3>Bring the context.</h3><p>Describe your project, who it is for, and the moment you are building toward. Good direction starts with specifics.</p>
              </article>
              <article className="step-card">
                <span className="step-number">STEP 02 / SHAPE</span><ArrowRight className="step-arrow" size={16} />
                <h3>Explore a direction.</h3><p>Develop a campaign idea, its tone, and creative territory around what makes your product worth noticing.</p>
              </article>
              <article className="step-card">
                <span className="step-number">STEP 03 / ORGANIZE</span>
                <h3>Make a plan to ship.</h3><p>Keep the concept and project tasks in one workspace, then prepare the pieces your team needs for a launch.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="demo-section" id="demo">
          <div className="container">
            <div className="demo-wrap">
              <div className="demo-panel">
                <div className="demo-info">
                  <div className="eyebrow">Workspace preview</div>
                  <h2>Put a little shape around your next idea.</h2>
                  <p>Try the local product preview. Prompt a sample concept or create a browser-saved demo project—no account or wallet needed.</p>
                  <div className="demo-disclaimer">This is a local product demonstration.<br />No live AI, sync, campaign launch, or chain activity.</div>
                </div>
                <div className="demo-workspace">
                  <div className="demo-head">
                    <strong>Campaign concept workspace</strong>
                    <span className="demo-label">LOCAL DEMO</span>
                  </div>
                  <label className="demo-label" htmlFor="campaign-prompt">Your creative brief</label>
                  <textarea
                    className="demo-prompt"
                    id="campaign-prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={samplePrompt}
                    aria-label="Describe your Solana campaign concept"
                    data-testid="input-campaign-prompt"
                  />
                  <div className="demo-actions">
                    <button className="button button-primary" onClick={makeConcept} data-testid="button-generate-concept">
                      <Sparkles size={14} /> Prompt a concept
                    </button>
                    <button className="button button-quiet" onClick={createCampaign} data-testid="button-create-local-project">
                      <Plus size={14} /> Create local project
                    </button>
                  </div>
                  <div className="demo-output" role="status" aria-live="polite" data-testid="status-demo-output">
                    <span className="output-mark"><Command size={14} /></span>
                    <div className="output-content">
                      <strong>{concept ? 'Preview output · simulated' : 'Your canvas is ready'}</strong>
                      <p>{concept || 'Add a brief and prompt a sample concept. This interaction runs locally; it does not call an AI provider.'}</p>
                    </div>
                  </div>
                  {campaigns.map((campaign) => (
                    <div className="local-project" key={campaign.id} data-testid={`card-local-project-${campaign.id}`}>
                      <div><b>{campaign.name}</b><small>LOCAL DEMO · CREATED {campaign.createdAt.toUpperCase()}</small></div>
                      <button
                        type="button"
                        onClick={() => changeStatus(campaign.id)}
                        aria-label={`Change ${campaign.name} status from ${campaign.status}`}
                        data-testid={`button-change-status-${campaign.id}`}
                      >
                        {campaign.status} · change
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section pricing-section" id="pricing">
          <div className="container pricing-layout">
            <div className="pricing-intro">
              <div className="eyebrow">Straightforward by design</div>
              <h2>Start with the workspace.</h2>
              <p>Explore the MemeReach workflow without a sales call, wallet connection, or invented promises.</p>
              <div className="pricing-note">Preview access details will be shared when product access is ready.</div>
            </div>
            <article className="price-card">
              <div className="price-head">
                <div><h3>Workspace preview</h3><p>A first look at the creative workflow.</p></div>
                <span className="price-label">Preview</span>
              </div>
              <div className="price-amount"><strong>Explore</strong><span>the local demo below</span></div>
              <div className="included">
                <span><Check size={14} /> Sample creative brief and concept flow</span>
                <span><Check size={14} /> Browser-saved demo project</span>
                <span><Check size={14} /> Campaign status interaction</span>
                <span><Check size={14} /> No wallet connection required</span>
              </div>
              <button className="button button-primary" onClick={scrollToDemo} data-testid="button-pricing-preview">
                Open the workspace preview <ArrowUpRight size={14} />
              </button>
              <div className="price-disclaimer">Demo features run locally. Production access, provider integrations, and any future pricing are not represented here.</div>
            </article>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="container faq-layout">
            <div className="faq-title">
              <div className="eyebrow">Good to know</div>
              <h2>Clear answers.<br /><span className="gradient">No fine print.</span></h2>
              <p>A little clarity goes a long way when you are building something new.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const expanded = openFaq === index;
                return (
                  <div className="faq-item" key={faq.question}>
                    <button
                      className="faq-question"
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenFaq(expanded ? null : index)}
                      data-testid={`button-faq-${index + 1}`}
                    >
                      {faq.question}<Plus size={16} aria-hidden="true" />
                    </button>
                    {expanded && <div className="faq-answer" id={`faq-answer-${index}`} data-testid={`text-faq-answer-${index + 1}`}>{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="final-cta" id="get-started">
          <div className="container">
            <div className="cta-panel">
              <div className="cta-copy">
                <div className="eyebrow">Build with a point of view</div>
                <h2>Your next Solana story starts with a sharper brief.</h2>
                <p>Step into the preview and give an idea somewhere to go.</p>
              </div>
              <button className="button button-primary" onClick={scrollToDemo} data-testid="button-final-cta">
                Explore MemeReach <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <a className="brand" href="#home" data-testid="link-footer-home"><span className="brand-mark" aria-hidden="true"><span /></span><span>Meme<em>Reach</em></span></a>
              <p>A creative and campaign workspace for teams building on Solana.</p>
            </div>
            <div className="footer-col">
              <h4>Workspace</h4>
              <a href="#platform" data-testid="link-footer-platform">Platform</a>
              <a href="#how-it-works" data-testid="link-footer-how-it-works">How it works</a>
              <a href="#demo" data-testid="link-footer-preview">Preview</a>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <a href="#pricing" data-testid="link-footer-pricing">Pricing</a>
              <a href="#faq" data-testid="link-footer-faq">Frequently asked</a>
              <a href="#get-started" data-testid="link-footer-start">Get started</a>
            </div>
            <div className="footer-col">
              <h4>Built with clarity</h4>
              <span className="footer-note">Local preview only</span>
              <span className="footer-note">Solana-first product direction</span>
              <span className="footer-note">No wallet required</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} MemeReach. Product preview.</span>
            <span>Actual AI generation, account sync, and campaign launch require backend/provider setup and a verified Solana program.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary>
            <Switch>
              <Route path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </RoutedErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
