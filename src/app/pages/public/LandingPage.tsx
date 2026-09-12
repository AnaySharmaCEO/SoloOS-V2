import { CheckCircle, ArrowRight, Bell, Target, Zap, Clock, ArrowUpRight, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { AuthCTA } from '../../components/public/AuthCTA';
import { PlanCards } from '../../components/soloos/PlanCards';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero */}
      <section className="border-b border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              The follow-up you meant to send, sent on time.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              SoloOS is a lightweight pipeline for freelancers and solo consultants — leads, follow-ups,
              proposals, and pricing, in one place that doesn't need a spreadsheet behind it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <AuthCTA
                variant="primary"
                className="bg-green text-white px-7 py-3.5 rounded-lg hover:bg-green-hover transition-all font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <span className="flex items-center gap-2">
                  Start free
                  <ArrowRight className="w-4 h-4" />
                </span>
              </AuthCTA>

              <AuthCTA
                variant="secondary"
                guestTo="/login"
                className="bg-card text-foreground px-7 py-3.5 rounded-lg hover:bg-muted transition-all font-semibold text-sm border border-border flex items-center justify-center"
              >
                See a live workspace
              </AuthCTA>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Free forever up to 5 leads and 2 clients. No card required.
            </p>
          </div>

          {/* Hero Visual: Cropped, styled preview of the Dashboard */}
          <div className="mt-12 max-w-3xl mx-auto rounded-xl border border-border bg-card shadow-lg p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ember" />
                <span className="text-xs font-bold text-foreground">Needs you right now</span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">Monday 9:00 AM</span>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 flex items-center justify-between border-l-4 border-l-ember shadow-2xs">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-foreground">Alyssa Simons is waiting on a callback</div>
                <div className="text-xs text-muted-foreground">Call scheduled — this has been sitting since yesterday</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-ember bg-ember-tint px-2.5 py-0.5 rounded-full">
                  Overdue
                </span>
                <span className="text-muted-foreground text-sm font-bold">→</span>
              </div>
            </div>

            {/* Mini Pipeline snapshot preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-semibold text-foreground">Pipeline snapshot</span>
                <span className="font-mono font-bold text-green">$30,200 active</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="bg-border h-full w-[20%]" title="New Lead" />
                <div className="bg-ember h-full w-[35%]" title="Warm Lead" />
                <div className="bg-green h-full w-[45%]" title="Proposal Sent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The problem, stated plainly */}
      <section id="problem" className="py-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              You didn't lose the client. You lost track of the follow-up.
            </h2>
            <p className="text-base text-muted-foreground">The six ways solo pipelines actually leak revenue.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'A warm lead goes quiet', desc: 'You had their attention. A week passed. Now it’s cold.' },
              { title: 'The follow-up gets buried', desc: 'It’s in your inbox somewhere — you just don’t know where.' },
              { title: 'The proposal sits in drafts', desc: 'You meant to send it Tuesday. It’s Friday.' },
              { title: 'You quote without a reference point', desc: 'No record of what you charged last time, for what.' },
              { title: 'Three spreadsheet tabs deep', desc: 'And you still can’t find that client’s last note.' },
              { title: 'Nothing tells you what’s urgent today', desc: 'Everything feels equally important, so nothing gets done first.' },
            ].map((problem, i) => (
              <div key={i} className="bg-card p-5 rounded-xl border border-border shadow-2xs space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember shrink-0" />
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed pl-3.5">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for one person — Product Scenes */}
      <section className="py-20 bg-card/30 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-green">Product Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built for one person running the whole pipeline
            </h2>
            <p className="text-base text-muted-foreground">
              Not a scaled-down corporate CRM. A workspace sized for exactly one person's sales process, from first contact to getting paid.
            </p>
          </div>

          {/* 3 Real Product Scenes */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Scene 1: Sized for one (usage indicator) */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-sm">Sized for one operator</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  No seats, roles, or team settings you'll never touch.
                </p>
              </div>
              <div className="bg-surface rounded-lg p-3.5 border border-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Active capacity</span>
                  <span className="font-mono font-bold text-foreground">3 / 5 leads</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-green h-full w-[60%]" />
                </div>
                <div className="text-[11px] text-muted-foreground">Free plan · 2 spots remaining</div>
              </div>
            </div>

            {/* Scene 2: Follow-up action */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-sm">Built around action</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Every screen answers "what do I do next," not just "what happened."
                </p>
              </div>
              <div className="bg-surface rounded-lg p-3.5 border border-border space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                  <span>Due today</span>
                </div>
                <p className="text-xs text-muted-foreground italic">"Send revised scope breakdown to Mark"</p>
                <div className="flex justify-end">
                  <span className="text-[11px] font-bold text-green bg-green-tint px-2 py-0.5 rounded-sm">Send Now</span>
                </div>
              </div>
            </div>

            {/* Scene 3: Honest pricing baseline */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-xs flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <h3 className="font-bold text-foreground text-sm">Defendable quotes</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  A calibrated price range instead of quoting on a gut feeling.
                </p>
              </div>
              <div className="bg-surface rounded-lg p-3.5 border border-border text-center space-y-1">
                <div className="text-lg font-mono font-bold text-foreground">$4,500 – $7,200</div>
                <div className="text-[11px] text-green font-semibold">Calibrated against project scope</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's actually in the box */}
      <section id="features" className="py-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What's actually in the box</h2>
            <p className="text-base text-muted-foreground">The parts that are built, working, and free to use today.</p>
          </div>

          <div className="space-y-14">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="text-xs font-bold text-ember">Follow-up queue</div>
                <h3 className="text-2xl font-bold text-foreground">A single list of who needs a nudge today</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Sorted by urgency — not scattered across fifteen open browser tabs and forgotten drafts.
                </p>
                <ul className="space-y-2 text-xs">
                  {[
                    'Due-today follow-ups, surfaced automatically',
                    'At-risk leads flagged before they go cold',
                    'One tap to log contact and reschedule',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground font-medium">
                      <CheckCircle className="w-4 h-4 text-green shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border shadow-xs">
                <div className="bg-ember-tint border border-ember/20 p-4 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 text-ember font-bold text-xs">
                    <Bell className="w-4 h-4" />
                    <span>4 follow-ups due today</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Queued automatically from your active leads and overdue callback dates.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="order-2 md:order-1 bg-card p-6 rounded-xl border border-border shadow-xs text-center space-y-3">
                <div className="font-mono text-3xl font-bold text-foreground">$4,500 – $7,200</div>
                <div className="inline-flex items-center gap-1.5 text-xs text-green font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Strategic pricing estimate</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Based on scope, urgency, and expected business impact.</p>
              </div>
              <div className="order-1 md:order-2 space-y-4">
                <div className="text-xs font-bold text-green">Pricing calculator</div>
                <h3 className="text-2xl font-bold text-foreground">A price range in under a minute</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Built from deliverable scope, timeline urgency, and business impact — so your quote has a reference point instead of a guess.
                </p>
                <ul className="space-y-2 text-xs">
                  {[
                    'A price range in under 60 seconds',
                    'Saved history you can compare against next time',
                    'Every estimate attached to the lead it was for',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground font-medium">
                      <CheckCircle className="w-4 h-4 text-green shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="text-xs font-bold text-green">Lead pipeline</div>
                <h3 className="text-2xl font-bold text-foreground">Every deal on one screen, moved by hand</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Stage by stage, with the deal value attached so you can see where money is actually sitting right now.
                </p>
                <ul className="space-y-2 text-xs">
                  {[
                    'Clean stage tracking from contact to won deal',
                    'At-risk flags for stalled opportunities',
                    'Total active pipeline value at a glance',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground font-medium">
                      <CheckCircle className="w-4 h-4 text-green shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-5 rounded-xl border border-border shadow-xs space-y-2">
                {['New lead', 'Warm lead', 'Proposal sent'].map((stage, i) => (
                  <div key={i} className="bg-surface p-3 rounded-lg border border-border flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground">{stage}</span>
                    <span className="font-mono text-muted-foreground">{3 - i} leads</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* From first contact to paid (4-step sequence) */}
      <section id="how-it-works" className="py-20 bg-card/30 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">From first contact to paid</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Add the lead', desc: 'Takes ten seconds, from any source' },
              { step: '2', title: 'Follow up on time', desc: 'The queue tells you who’s due' },
              { step: '3', title: 'Send a priced proposal', desc: 'With a range you can defend' },
              { step: '4', title: 'Mark it won', desc: 'It becomes a client record automatically' },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="w-10 h-10 bg-green text-white rounded-full flex items-center justify-center mx-auto font-mono text-sm font-bold shadow-xs">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing section — 2 tiers (Free and Pro) */}
      <section id="pricing" className="py-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Straightforward pricing</h2>
            <p className="text-base text-muted-foreground">Start free. Upgrade only when Pro actually pays for itself.</p>
          </div>
          <PlanCards context="marketing" />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-card/30 border-b border-border">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Common questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Why not just use a spreadsheet?',
                a: 'Spreadsheets are fine for storing data. They’re bad at telling you what to do today. SoloOS surfaces the one thing that’s actually due, instead of making you scan rows for it.',
              },
              {
                q: 'Is this only for freelancers?',
                a: 'It’s built for anyone running their own sales pipeline solo — consultants, freelancers, independent service providers. If you’re not managing a sales team, it’s built for you.',
              },
              {
                q: 'What happens when I outgrow the free plan?',
                a: 'Nothing breaks or locks up. When you reach 5 active leads or 2 active clients, you’ll be prompted to upgrade to Pro for unlimited volume, or archive completed deals to make room.',
              },
              {
                q: 'What’s actually free, versus what’s Pro?',
                a: 'Your whole pipeline — leads, follow-ups, proposals, clients, the pricing calculator, CSV export — is free up to 5 active leads and 2 clients. Pro adds unlimited capacity, Weekly Revenue Debriefs, AI-drafted follow-ups, and Deal Radar prioritization.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-card p-5 rounded-xl border border-border space-y-1.5 shadow-2xs">
                <h3 className="font-semibold text-foreground text-sm">{item.q}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Get your pipeline out of your head</h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Free to start. Takes about two minutes to add your first lead.
          </p>
          <div>
            <AuthCTA
              variant="primary"
              className="inline-flex items-center gap-2 bg-green text-white px-7 py-3.5 rounded-lg hover:bg-green-hover transition-all font-semibold text-sm shadow-xs"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </AuthCTA>
          </div>
          <p className="text-xs text-muted-foreground">Free forever up to 5 leads and 2 clients. No card required.</p>
        </div>
      </section>
    </div>
  );
}
