import { BASE_URL } from "./Constants";

export default async function fetchData() {
  const actCats = await fetch(`${BASE_URL}activity_categories`, {
    next: { tags: ["activity_categories"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const acts = await fetch(`${BASE_URL}activities`, {
    next: { tags: ["activities"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const checks = await fetch(`${BASE_URL}wellbeing_checks`, {
    next: { tags: ["wellbeing_checks"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const emotions = await fetch(`${BASE_URL}emotions`, {
    next: { tags: ["emotions"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const meals = await fetch(`${BASE_URL}meals`, {
    next: { tags: ["meals"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const results = await Promise.all([actCats, acts, checks, emotions, meals]);
  return results;
}
