import ActivityInput from "./components/ActivityInput";

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/activity_categories/", {
    next: { tags: ["activity_categories"] },
  });

  if (!res?.ok) {
    throw new Error("Failed to fetch data");
  }

  return res?.json();
}

export default async function Dashboard() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mt-4 mb-8 drop-shadow-harsh text-center text-balance">
        How fucked is your head :)
      </h1>
      <div className="flex justify-between w-full">
        <ActivityInput data={data} />
      </div>
    </main>
  );
}
