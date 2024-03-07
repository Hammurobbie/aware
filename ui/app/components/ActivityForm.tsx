"use client";
import { FormEvent, SyntheticEvent, useState } from "react";
import axios from "axios";
import cx from "classnames";
import { refresh_activities } from "../actions";
import { refresh_categories } from "../actions";

const ActivityForm = ({ targetActivity, categories }: any) => {
  const initActivity = targetActivity
    ? {
        ...targetActivity,
        stop: toLocalISOString(new Date()),
      }
    : {
        name: "",
        start: toLocalISOString(new Date()),
        stop: "",
        category: "",
        category_id: "",
      };
  const [activity, setActivity] = useState(initActivity);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [confirmTarget, setConfirmTarget] = useState<string | undefined>(
    undefined
  );

  const triggerConfirm = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const newErrors = [];
    if (!activity.name) newErrors.push("name");
    if (!activity.category) newErrors.push("category");
    if (targetActivity && !activity.start) newErrors.push("start");
    if (targetActivity && !activity.stop) newErrors.push("stop");
    if (newErrors.length) {
      setErrors(newErrors);
    } else {
      setConfirmTarget(e?.nativeEvent?.submitter?.id);

      // handleSubmitActivity(e);
    }
  };

  // ^^ then swipe to delete/submit updates to avoid modal
  // TODO: place daily check in below until evening, then pull to top

  const handleSubmitActivity = () => {
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
    let bodyData = activity;
    const tarCat = categories.find(
      (cat: any) => cat.name === activity.category
    );
    if (tarCat) {
      bodyData = {
        ...bodyData,
        category_id: tarCat.id,
        category: "",
      };
    }

    const apiCall = targetActivity
      ? axios.put(url, bodyData, config)
      : axios.post(url, bodyData, config);

    apiCall
      .then(function (response) {
        if (response.status === 200) {
          setActivity(initActivity);
          setSuccess(true);
          refresh_categories();
          refresh_activities();
          setTimeout(() => {
            setSuccess(false);
          }, 5000);
        } else {
          throw new Error("Could not reach the API: " + response);
        }
      })
      .catch((e) => console.log(e));
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

  return (
    <div
      className={cx(
        "w-full text-center",
        !errors.length && !success ? "mt-8" : "",
        {
          "mb-4": targetActivity,
        }
      )}
    >
      {errors.length ? (
        <p className="text-error mb-2">Maybe finish the form first</p>
      ) : null}
      {success ? <p className="text-success mb-2">Nice, got it</p> : null}
      <div className="p-5 bg-grayscale rounded-sm shadow-harsh">
        <h2 className="text-xl text-light">{"What're you doin'?"}</h2>
        <form onSubmit={triggerConfirm} className="flex flex-col">
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
          <label className="mt-2 text-start text-bg-secondary" htmlFor="start">
            Start time
          </label>
          <input
            id="start"
            onChange={handleFormInput}
            type="datetime-local"
            className={cx(
              "mb-px mt-1 bg-light p-2 cursor-pointer",
              errors?.includes("start") && "ring ring-error"
            )}
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
            className={cx(
              "mb-px mt-1 bg-light p-2 cursor-pointer",
              errors?.includes("stop") && "ring ring-error"
            )}
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
            list={`category_select-${targetActivity?.id || ""}`}
            autoComplete="off"
          />
          <datalist id={`category_select-${targetActivity?.id || ""}`}>
            {categories?.map((cat: { name: string; id: number }) => (
              <option key={cat?.id} value={cat?.name}>
                {cat?.name}
              </option>
            ))}
          </datalist>
          {targetActivity && (
            <button
              id={`delete-button-${targetActivity?.id || ""}`}
              onClick={() => setIsDelete(true)}
              className="button p-2 mt-5 bg-light"
            >
              Delete activity
            </button>
          )}
          <button
            id={`submit-button-${targetActivity?.id || ""}`}
            onClick={() => isDelete && setIsDelete(false)}
            className="button p-2 mt-5 mb-2 bg-light"
          >
            {`${targetActivity ? "Edit" : "Add"} activity`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;