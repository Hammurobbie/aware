"use client";
import { FormEvent, useState } from "react";
import axios from "axios";

const ActivityInput = (data: any) => {
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
    const url = "http://127.0.0.1:8000/activities";
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "PUT, POST, PATCH, DELETE, GET",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    };

    axios
      .post(url, activity, config)
      .then(function (response) {
        if (response.status === 200) {
          console.log("shiiid", response);
          setActivity(initActivity);
          const categorySelect = document.getElementById(
            "category_select"
          ) as HTMLSelectElement;
          categorySelect.selectedIndex = 0;
        } else {
          throw new Error("Could not reach the API: " + response);
        }
      })
      .catch((e) => console.log(e));
  };

  const handleFormInput = (e: any) => {
    if (e.target.name === "category" && isNaN(e.target.value)) {
      setActivity({
        ...activity,
        category: e.target.value,
      });
    } else {
      setActivity({
        ...activity,
        [e.target.name]: e.target.value,
      });
    }
  };

  function toLocalISOString(date: any) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);
    return localDate.toISOString().slice(0, -1);
  }

  return (
    <div className="bg-grayscale rounded-sm p-5 shadow-harsh">
      <h2 className="text-xl text-light">What're you doing?</h2>
      <form onSubmit={handleSubmitActivity} className="flex flex-col">
        <input
          onChange={handleFormInput}
          type="text"
          className="my-2 bg-light p-2"
          name="name"
          autoComplete="off"
          placeholder="snorting meth"
          value={activity?.name}
        />
        <input
          onChange={handleFormInput}
          type="datetime-local"
          className="my-2 bg-light p-2"
          name="start"
          value={activity?.start}
          id="cal"
        />
        <input
          onChange={handleFormInput}
          type="datetime-local"
          className="my-2 bg-light p-2"
          name="stop"
          value={activity?.stop}
        />
        <select
          id="category_select"
          defaultValue="select"
          className="my-2 bg-light p-2 h-10 border-r-8 border-transparent"
          name="category_id"
          onChange={handleFormInput}
        >
          <option value="select" disabled={true}>
            select category
          </option>
          {data?.data?.map((cat: { name: string; id: number }) => (
            <option key={cat?.id} value={cat?.id}>
              {cat?.name}
            </option>
          ))}
        </select>
        <button className="button p-2 my-2 bg-light">Add activity</button>
      </form>
    </div>
  );
};

export default ActivityInput;
