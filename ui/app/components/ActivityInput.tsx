"use client";
import { FormEvent, useState } from "react";
import axios from "axios";
import cx from "classnames";
import refresh_categories from "../actions";
import Toggle from "./Toggle";

const ActivityInput = (data: any) => {
  const initActivity = {
    name: "",
    start: toLocalISOString(new Date()),
    stop: "",
    category: "",
    category_id: "",
  };
  const [activity, setActivity] = useState(initActivity);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [actToggle, setActToggle] = useState(false);

  const handleActToggle = () => setActToggle(!actToggle);

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
    if (!activity.name || !activity.category) {
      const newErrors = [];
      if (!activity.name) newErrors.push("name");
      if (!activity.category) newErrors.push("category");
      setErrors(newErrors);
    } else {
      let bodyData = activity;
      const tarCat = data?.data.find(
        (cat: any) => cat.name === activity.category
      );
      if (tarCat) {
        bodyData = {
          ...bodyData,
          category_id: tarCat.id,
          category: "",
        };
      }

      axios
        .post(url, bodyData, config)
        .then(function (response) {
          if (response.status === 200) {
            setActivity(initActivity);
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 5000);
            refresh_categories();
          } else {
            throw new Error("Could not reach the API: " + response);
          }
        })
        .catch((e) => console.log(e));
    }
  };

  const handleFormInput = (e: any) => {
    if (errors.includes(e.target.name))
      setErrors(errors.filter((err) => err !== e.target.name));
    setActivity({
      ...activity,
      [e.target.name]: e.target.value,
    });
  };

  function toLocalISOString(date: any) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);
    return localDate.toISOString().slice(0, -1);
  }

  // TODO: pull up list of unfinished activities to edit/add stop time to

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex justify-end items-center mb-4">
        <p className="mr-4">
          {actToggle ? "unfinished activities" : "new activity"}
        </p>
        <Toggle isToggled={actToggle} toggleFunc={handleActToggle} />
      </div>
      <div
        className={cx(
          "w-full text-center",
          !errors.length && !success ? "mt-8" : ""
        )}
      >
        {errors.length ? (
          <p className="text-error mb-2">Maybe finish the form first</p>
        ) : null}
        {success ? <p className="text-success mb-2">Nice, got it</p> : null}
        <div className="p-5 bg-grayscale rounded-sm shadow-harsh">
          <h2 className="text-xl text-light">{"What're you doing?"}</h2>
          <form onSubmit={handleSubmitActivity} className="flex flex-col">
            <label className="mt-2 text-start text-bg-secondary" htmlFor="name">
              Activity name
            </label>
            <input
              id="name"
              onChange={handleFormInput}
              type="text"
              className={cx(
                "mb-px mt-1 bg-light p-2",
                errors?.includes("name") && "ring ring-error"
              )}
              name="name"
              autoComplete="off"
              placeholder="snorting meth"
              value={activity?.name}
            />
            <label
              className="mt-2 text-start text-bg-secondary"
              htmlFor="start"
            >
              Start time
            </label>
            <input
              id="start"
              onChange={handleFormInput}
              type="datetime-local"
              className="mb-px mt-1 bg-light p-2 cursor-pointer"
              name="start"
              value={activity?.start}
            />
            <label className="mt-2 text-start text-bg-secondary" htmlFor="stop">
              Stop time
            </label>
            <input
              id="stop"
              onChange={handleFormInput}
              type="datetime-local"
              className="mb-px mt-1 bg-light p-2 cursor-pointer"
              name="stop"
              value={activity?.stop}
            />
            <label
              className="mt-2 text-start text-bg-secondary"
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              placeholder="select or add new"
              className={cx(
                "mb-px mt-1 bg-light p-2 h-10",
                errors?.includes("category") && "ring ring-error"
              )}
              name="category"
              value={activity?.category}
              onChange={handleFormInput}
              list="category_select"
              autoComplete="off"
            />
            <datalist id="category_select">
              {data?.data?.map((cat: { name: string; id: number }) => (
                <option key={cat?.id} value={cat?.name}>
                  {cat?.name}
                </option>
              ))}
            </datalist>
            <button className="button p-2 mt-5 mb-2 bg-light">
              Add activity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityInput;
