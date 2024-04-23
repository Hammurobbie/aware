import Dashboard from "./components/Dashboard";
import fetchData from "./utils/FetchData";

export default async function Home() {
  const data = await fetchData();
  const categories = await data?.[0]?.json();
  const activities = await data?.[1]?.json();
  const checkins = await data?.[2]?.json();
  const emotions = await data?.[3]?.json();
  const meals = await data?.[4]?.json();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 max-w-2xl mx-auto">
      <div className="flex flex-col justify-between w-full">
        <Dashboard
          categories={categories}
          activities={activities}
          checkins={checkins}
          emotions={emotions}
          meals={meals}
        />
      </div>
    </main>
  );
}
