---
title: Pre-Launch Delivery Checklist
impact: MEDIUM
impactDescription: Missed pre-launch items cause 30% of post-release hotfixes
tags: delivery, launch, checklist, release, deployment
---

## Pre-Launch Delivery Checklist

Use this checklist before every major release to ensure nothing falls through the cracks.

### Product Readiness

- [ ] All sprint stories meet Definition of Done
- [ ] Product Owner has accepted all deliverables
- [ ] User-facing documentation is updated (help docs, FAQs, changelogs)
- [ ] Release notes are written for stakeholders

### Technical Readiness

- [ ] All automated tests pass (unit, integration, E2E)
- [ ] Performance testing completed (load, stress, soak)
- [ ] Security scan completed (SAST, DAST, dependency audit)
- [ ] Database migrations tested on staging
- [ ] Feature flags configured for staged rollout
- [ ] Monitoring and alerting configured for new features
- [ ] Error tracking (Sentry/equivalent) configured

### Operational Readiness

- [ ] Deployment runbook reviewed and updated
- [ ] Rollback plan documented and tested
- [ ] On-call schedule confirmed for launch window
- [ ] Support team briefed on new features and known issues
- [ ] Third-party dependencies verified (API keys, rate limits, SLAs)

### Communication Readiness

- [ ] Internal stakeholders notified of launch date/time
- [ ] External communication scheduled (blog, email, social)
- [ ] Support channels prepared for increased volume
- [ ] Success metrics defined and tracking configured

### Post-Launch (First 24-48 Hours)

- [ ] Monitor error rates and response times
- [ ] Check key business metrics (conversion, engagement)
- [ ] Collect initial user feedback
- [ ] Document lessons learned for retrospective
- [ ] Celebrate the team 🎉

### Go/No-Go Decision Framework

| Gate | Pass Criteria |
|------|--------------|
| Quality | All critical/high bugs resolved, test pass rate > 95% |
| Performance | P95 latency within SLA, no degradation from baseline |
| Security | No critical/high vulnerabilities open |
| Business | Stakeholder sign-off received |
| Operations | Runbook complete, rollback tested, on-call confirmed |
