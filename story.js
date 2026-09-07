(() => {
  const get = id => document.getElementById(id);
  const card = get('team-example');
  if (!card) return;
  const approve = get('approve-finance');
  const pause = get('pause-example');
  const replay = get('reset-dependencies');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Scripted illustration only: no AI, customer data, tool calls or real sends.
  // This bounded example ends at a prepared next action. Long-running ownership
  // remains separately labelled under test in the annual-goal card.
  const company = { phase: motion.matches ? 3 : 0, approved: false, paused: false };
  let visible = !('IntersectionObserver' in window);
  let timer = null;
  const text = (id, value) => { get(id).textContent = value; };

  function render() {
    const { phase, approved, paused } = company;
    const ready = phase >= 3;
    const sent = phase >= 4;
    const result = phase >= 5;
    const replanned = phase === 6;
    text('demo-phase', ['Issue identified', 'Work started', 'Drafts ready', 'Capacity confirmed', 'Outreach sent', 'Result checked', 'Next work prepared'][phase]);
    text('company-signal', result ? 'Replies up. Meetings unchanged.' : ready ? 'Interest high. Capacity verified.' : 'High interest. Onboarding full.');
    text('company-decision', result ? 'Resolve setup doubts before selling.' : ready ? 'Expand outreach. Keep setup checks.' : 'Fix onboarding before outreach.');
    text('marketing-plan', phase >= 2 ? 'Customer proof ready ✓' : 'Prepare customer proof');
    text('marketing-status', phase >= 2 ? 'Prepared by AI' : phase === 1 ? 'AI drafting now' : 'Starts automatically');
    text('product-plan', phase >= 2 ? 'Setup guide ready ✓' : 'Prepare setup guide');
    text('product-status', ready ? 'Product confirmed capacity ✓' : phase >= 1 ? 'Capacity review continues' : 'Product checks capacity');
    get('marketing-work').setAttribute('data-done', String(phase >= 2));
    get('product-work').setAttribute('data-done', String(ready));
    text('sales-plan', replanned ? 'Guided demo prepared ✓' : result ? 'Investigating stalled meetings' : sent ? 'Outreach sent · CRM updated ✓' : ready ? 'Ready to launch approved outreach' : 'Outreach waits. Preparation continues.');
    text('capacity-evidence', ready ? 'Capacity verified' : 'Onboarding full');
    text('sales-evidence', result ? 'Replies ask for setup help' : 'Implementation concerns');
    text('expansion-answer', result ? 'Remove the next blocker.' : ready ? 'Now we’re ready.' : 'Not the next move.');
    text('shared-next-step', result ? 'Setup questions → Prepare a guided demo.' : ready ? 'Keep setup checks. Expand outreach.' : 'Fix onboarding + build customer proof.');
    get('story').setAttribute('data-example-state', ready ? 'resolved' : 'blocked');
    approve.disabled = approved || phase === 0;
    approve.textContent = approved ? 'Approved ✓' : 'Approve';
    text('team-demo-note', replanned ? 'Example complete. No real work executed.'
      : result ? 'More replies did not mean more meetings.'
      : sent ? 'Indalbo checks replies and meetings.'
      : approved ? (ready ? 'Approved. Outreach proceeds automatically.' : 'Approved. Product’s capacity review continues.')
      : ready ? 'Only outreach is waiting for approval.'
      : 'Outreach waits. Other work continues.');
    // The outcome preview stays visible even without motion or interaction.
    text('outcome-label', sent ? 'Observed result → Next move' : 'After outreach → Next move');
    text('outcome-result', sent && !result ? 'Checking replies + meetings…' : 'Replies ↑ · Meetings flat');
    text('outcome-action', replanned ? 'Setup questions → Guided demo prepared' : 'Read replies → Draft walkthrough');
    pause.hidden = motion.matches || phase === 6;
    pause.textContent = paused ? 'Resume' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Resume the example animation' : 'Pause the example animation');
    replay.hidden = phase !== 6;
  }

  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (!visible || document.hidden || company.paused || motion.matches) return;
    const { phase, approved } = company;
    if (phase === 6 || (phase === 3 && !approved)) return;
    timer = setTimeout(() => {
      timer = null;
      // Routine preparation does not depend on approval. Sending does.
      if (company.phase === 3 && !company.approved) return;
      company.phase++;
      render();
      schedule();
    }, phase === 0 ? 2200 : 3200);
  }

  approve.addEventListener('click', () => {
    if (company.phase === 0 || company.approved) return;
    company.approved = true;
    if (motion.matches) company.phase = 6; // Static completion, no timed movement.
    render();
    schedule();
  });
  pause.addEventListener('click', () => {
    company.paused = !company.paused;
    render();
    schedule();
  });
  replay.addEventListener('click', () => {
    Object.assign(company, { phase: motion.matches ? 3 : 0, approved: false, paused: false });
    render();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    if (motion.matches) company.phase = company.approved ? 6 : 3;
    render();
    schedule();
  });
  if ('IntersectionObserver' in window) {
    const observer = new window.IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      schedule();
    }, { threshold: 0.2 });
    observer.observe(card);
  }
  render();
  schedule();
})();
