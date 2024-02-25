import ActivityInput from "./components/ActivityInput";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold mb-12">
        Let's quantify how fucked your life is :)
      </h1>
      <div className="flex justify-between">
        <ActivityInput />
      </div>
    </main>
  );
}
