import ActivityInput from "./components/ActivityInput";

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/activity_categories/");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Dashboard() {
  const data = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-12 drop-shadow-harsh">
        Let's quantify how fucked your brain is :)
      </h1>
      <div className="flex justify-between">
        <ActivityInput data={data} />
      </div>
    </main>
  );
}
