import ActivityInput from "./components/Dashboard";

async function getCats() {
  const res = await fetch("http://127.0.0.1:8000/activity_categories", {
    next: { tags: ["activity_categories"] },
  }).catch((err) => console.log(err));

  return res?.json();
}

async function getActs() {
  const res = await fetch("http://127.0.0.1:8000/activities", {
    next: { tags: ["activities"] },
  }).catch((err) => console.log(err));

  return res?.json();
}

export default async function Home() {
  const categories = await getCats();
  const activities = await getActs();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 max-w-2xl mx-auto">
      <div className="flex justify-between w-full">
        <ActivityInput categories={categories} activities={activities} />
      </div>
    </main>
  );
}
