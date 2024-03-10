import CheckinForm from "./components/CheckinForm";
import Dashboard from "./components/Dashboard";

async function getData() {
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

  const results = await Promise.all([actCats, acts, checks]);
  return results;
}

export default async function Home() {
  const data = await getData();
  const categories = await data?.[0]?.json();
  const activities = await data?.[1]?.json();
  const checkins = await data?.[2]?.json();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 max-w-2xl mx-auto">
      <div className="flex flex-col justify-between w-full">
        <Dashboard
          categories={categories}
          activities={activities}
          checkins={checkins}
        />
      </div>
    </main>
  );
}
