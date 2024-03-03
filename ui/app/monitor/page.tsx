import Image from "next/image";

async function getData() {
  const res = await fetch("http://127.0.0.1:8000/wellbeing_checks/");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res?.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res?.json();
}

export default async function Monitor() {
  const data = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full flex flex-wrap">
        {data?.map((wbc: any, key: number) => (
          <div
            key={key}
            className="flex flex-col justify-center items-center p-5 m-5 bg-slate-800 rounded-xl"
          >
            <div>{wbc?.notes}</div>
            {wbc?.updated_emotions?.map((e: any, key: number) => (
              <p key={key} className="text-slate-400 pt-2">
                {e.name}
              </p>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
