# Real-device checklist (Phase 1)

Automated tests cover WebKit (Safari's engine) at iPhone SE, iPhone 15, and iPad portrait and landscape sizes, plus desktop Chrome and Safari and a 320px phone. They can't check the items below, so these need a real device. Each takes a minute or two.

## iPad (Safari): the acceptance test
- [ ] Give the iPad to a teacher who has never seen LitSketch. Say only: "Make doodle notes for this passage." Time it. **Goal: printable notes in under 5 minutes.**
- [ ] Note every pause or question they have. Those are the fixes to make.

## iPad and iPhone (Safari)
- [ ] **Add to Home Screen:** Share → Add to Home Screen. The icon is the green pencil and page. It opens full screen with no Safari bars.
- [ ] **Notch and home bar:** in the Home Screen app, nothing is hidden behind the notch or the home indicator, in portrait and landscape.
- [ ] **Larger Text:** Settings → Accessibility → Display & Text Size → Larger Text, set to the largest size. Text in LitSketch gets bigger, and nothing overlaps or scrolls sideways.
- [ ] **VoiceOver:** turn it on and swipe through each step. You should hear the headings in order ("Add your reading passage", and so on), every button by name, and error messages read out when they appear.
- [ ] **Print:** tap Print, then pinch out on the preview. Each page has the benchmark code at the top and bottom, nothing is cut off, and the pages are black and white.
- [ ] **Save or share PDF:** the share sheet opens. AirDrop to a Mac, Mail to yourself, and Save to Files all work. The PDF text is selectable.

## Mac (Safari)
- [ ] Print → PDF → Save as PDF. Same checks as the iPad print test. With "Print headers and footers" turned on, the pages should still fit.
- [ ] Save or share PDF opens the Mac share menu (AirDrop, Mail).

## Chromebook (Chrome) and Windows (Edge)
- [ ] Print → Save as PDF. Pages match the iPad output.
- [ ] Save or share PDF downloads a file.
- [ ] Tab through the whole flow with the keyboard only. The focus ring is always visible.
