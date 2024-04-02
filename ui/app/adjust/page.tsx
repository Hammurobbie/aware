import CategorySwitcher from "../components/CategorySwitcher";
import fetchData from "../utils/FetchData";

export default async function Adjust() {
  const data = await fetchData();
  const categories = await data?.[0]?.json();
  const activities = await data?.[1]?.json();
  const checkins = await data?.[2]?.json();
  const emotions = await data?.[3]?.json();
  const meals = await data?.[4]?.json();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mt-4 mb-8 drop-shadow-harsh text-center text-balance">
        Adjust
      </h1>
      <CategorySwitcher
        activities={activities}
        categories={categories}
        meals={meals}
        checkins={checkins}
        emotions={emotions}
      />
    </main>
  );
}
