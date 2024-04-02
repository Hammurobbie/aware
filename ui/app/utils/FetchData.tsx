export default async function fetchData() {
  const actCats = await fetch("http://127.0.0.1:8000/activity_categories", {
    next: { tags: ["activity_categories"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const acts = await fetch("http://127.0.0.1:8000/activities", {
    next: { tags: ["activities"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const checks = await fetch("http://127.0.0.1:8000/wellbeing_checks", {
    next: { tags: ["wellbeing_checks"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const emotions = await fetch("http://127.0.0.1:8000/emotions", {
    next: { tags: ["emotions"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const meals = await fetch("http://127.0.0.1:8000/meals", {
    next: { tags: ["meals"] },
  }).catch((err) => {
    return null;
    console.log(err);
  });

  const results = await Promise.all([actCats, acts, checks, emotions, meals]);
  return results;
}
