# GYMLOG V6 data and research

This folder contains GYMLOG-authored methodology and evidence references for the V6 exercise library.

## Visual reference data

Exercise illustrations and detailed primary/secondary muscle metadata are loaded at runtime from the RepDB free exercise dataset:

- Dataset: https://github.com/RepDB/exercise-dataset
- Runtime JSON: https://exercise-dataset.com/exercises.json
- Attribution required in the app: **Exercise data by RepDB (repdb.co)**

The dataset license permits free personal and commercial in-app use with attribution. It prohibits republishing the dataset as a separate dataset/API and prohibits using its images as generative-AI inputs. To respect those terms, GYMLOG does not copy the RepDB JSON or WebP assets into this repository. The app references their hosted image paths and provides attribution.

The free tier provides flat illustrations, usually start and peak poses. It does not provide the premium transparent animation pack or premium muscle heatmap. The V6 muscle silhouette is a GYMLOG-authored schematic overlay based on the exercise's primary and secondary muscle metadata; it is educational, not a clinical anatomical atlas.

## Ranking methodology

See [v6-evidence.json](./v6-evidence.json). The 0–100 value in the app is named **Practical Selection Fit**. It is a heuristic score for metadata completeness and practical usability, not a scientific effectiveness score or a claim that one exercise produces more hypertrophy than another.

Scientific evidence is displayed separately from the heuristic score. The app does not claim exercise-specific randomized trial evidence unless a source directly supports that claim.

## Community feedback

Online forum discussions are linked as qualitative context only. Their votes and anecdotes are not representative samples and are not merged into scientific ratings. The in-app rating is private, stored locally on the user's device, and is not an internet-wide score.

## Research sources

- Currier et al. (2026), ACSM Position Stand / overview of 137 systematic reviews: https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/
- Baz-Valle et al. (2022), systematic review on exercise variation: https://pubmed.ncbi.nlm.nih.gov/35438660/
- Kassiano et al. (2023), systematic review on range of motion and hypertrophy: https://pubmed.ncbi.nlm.nih.gov/36662126/
- Schoenfeld et al. (2024), technique and hypertrophy narrative review: https://pubmed.ncbi.nlm.nih.gov/38249086/

Research informs the guidance, but individual exercise selection should still account for goals, technique, comfort, equipment access, and the ability to progress.
