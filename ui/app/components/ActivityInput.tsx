"use client";
import { FormEvent, useState } from "react";

const ActivityInput = () => {
  const initActivity = {
    name: "",
    start: toLocalISOString(new Date()),
    stop: "",
    category: "",
    category_id: null,
  };
  const [activity, setActivity] = useState(initActivity);

  const handleSubmitActivity = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleFormInput = (e: any) => {
    setActivity({
      ...activity,
      [e.target.name]: e.target.value,
    });
  };

  function toLocalISOString(date: any) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, -1);
  }

  return (
    <div className="bg-grayscale rounded-lg p-5 shadow-xl">
      <h2 className="text-xl text-light">What're you doing?</h2>
      <form onSubmit={handleSubmitActivity} className="flex flex-col">
        <input
          onChange={handleFormInput}
          type="text"
          className="my-2 bg-light"
          name="name"
          autoComplete="off"
          placeholder="snorting meth"
          value={activity?.name}
        />
        <input
          onChange={handleFormInput}
          type="datetime-local"
          className="my-2 bg-light"
          name="start"
          value={activity?.start}
          id="cal"
        />
        <input
          onChange={handleFormInput}
          type="datetime-local"
          className="my-2 bg-light"
          name="start"
          value={activity?.stop}
        />
        <select className="my-2 bg-light" name="category">
          <option disabled={true}>select category</option>
        </select>
        <button>Add activity</button>
      </form>
    </div>
  );
};

export default ActivityInput;
