# PublishReady regression results

Baseline tested from user-supplied files already accepted by Amazon KDP. The binary book files are not committed to this public repository.

## Accepted fixtures

| File | Expected result | Observed baseline |
|---|---|---|
| Paperback cover PDF | Pass | 1 page, 12.842276 x 9.250 in for 6 x 9, 263 pages, white paper |
| Paperback interior PDF | Pass with advisory | 263 pages, every page 6 x 9 in; final page is blank/near-blank and page count is odd. Neither is treated as a blocking failure. |
| Kindle EPUB | Pass | Valid mimetype/container/package, title/author/language/identifier present, 30 manifest items, 28 spine items, navigation present, no missing manifest files |
| eBook cover JPG | Pass | JPEG, RGB, 1365 x 2048 px, aspect ratio 0.6665 |

## Negative variants generated locally

| Variant | Expected result | Result |
|---|---|---|
| Cover 0.020 in narrow and proportionally short | Fail, safe repair allowed | Passed regression |
| Cover 0.200 in narrow | Fail, no automatic repair | Passed regression |
| Cover with width/height ratio drift | Fail, no automatic repair | Passed regression |
| Interior with page 11 changed to 5.5 x 8.5 | Blocking mixed-page-size failure | Passed regression |
| Interior with 262 pages while 263 is selected | Blocking page-count mismatch | Passed regression |
| EPUB missing title metadata | Blocking metadata failure | Passed regression |
| EPUB navigation item removed | Blocking navigation failure | Passed regression |
| EPUB manifest file removed | Blocking missing-file failure | Passed regression |

## Important accepted-file edge case

The accepted EPUB's `nav.xhtml` is not strict namespace-valid XML. Amazon KDP accepted it. PublishReady must therefore avoid turning strict XHTML namespace parsing into a blocking rule. Package structure, reading order, manifest targets, metadata, and navigation presence remain deterministic blocking checks.

## Current gate

These tests establish a trustworthy validation baseline. They do not yet validate generated paid deliverables for every trim size, paper type, bleed choice, or hardcover geometry. Paid checkout remains disabled until generated outputs are tested against a broader fixture matrix.
