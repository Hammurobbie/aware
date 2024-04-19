"use client";
import { FormEvent, SyntheticEvent, useState, useEffect } from "react";
import axios from "axios";
import cx from "classnames";
import { refresh_activities } from "../actions";
import { refresh_categories } from "../actions";
import FormButton from "./FormButton";
import ConfirmSlider from "../utils/ConfirmSlider";
import LocalDate from "../utils/LocalDate";

const ActivityForm = ({
  targetActivity,
  categories,
  confirmTarget,
  setConfirmTarget,
  setActToggle,
}: any) => {
  const initActivity = targetActivity
    ? {
        ...targetActivity,
        stop: LocalDate(new Date()),
      }
    : {
        name: "",
        start: LocalDate(new Date()),
        stop: "",
        category: "",
        category_id: "",
      };
  const [activity, setActivity] = useState(initActivity);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitter, setSubmitter] = useState("");

  useEffect(() => {
    setActivity({
      ...targetActivity,
      stop: LocalDate(new Date()),
    });
  }, [targetActivity, LocalDate, setActivity]);

  ConfirmSlider({
    confirmTarget,
    setConfirmTarget,
    targetId: `ac_${activity?.id || "ac"}`,
  });

  const triggerConfirm = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const isDelete = e?.nativeEvent?.submitter?.id?.includes("delete");
    const newErrors = [];
    if (!activity.name && !isDelete) newErrors.push("name");
    if (!activity.category && !isDelete) newErrors.push("category");
    if (targetActivity && !activity.start && !isDelete) newErrors.push("start");
    if (targetActivity && !activity.stop && !isDelete) newErrors.push("stop");
    if (newErrors.length) {
      setErrors(newErrors);
    } else {
      setConfirmTarget({
        target: e?.nativeEvent?.submitter?.id,
        isConfirmed: false,
      });
    }
  };

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
    let bodyData = activity;
    const tarCat = categories?.find(
      (cat: any) => cat.name === activity.category
    );
    if (tarCat) {
      bodyData = {
        ...bodyData,
        category_id: tarCat.id,
        category: "",
      };
    }

    const apiCall = submitter?.includes("delete")
      ? axios.delete(`${url}/${bodyData?.id}`, config)
      : targetActivity
      ? axios.put(`${url}/${bodyData?.id}`, bodyData, config)
      : axios.post(url, bodyData, config);

    const handleError = (e: any) => {
      setErrors([e]);
      setActivity(initActivity);
      setConfirmTarget({ target: "", isConfirmed: false });
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    };

    apiCall
      .then(function (response) {
        if (response.status === 200) {
          setActivity(initActivity);
          setSuccess(true);
          setConfirmTarget({ target: "", isConfirmed: false });
          refresh_activities();
          refresh_categories();
          setActToggle && setActToggle(false);
          setTimeout(() => {
            setSuccess(false);
          }, 5000);
        } else {
          handleError(response);
        }
      })
      .catch((e) => handleError(e));
  };

  const handleFormInput = (e: any) => {
    if (errors.includes(e.target.name))
      setErrors(errors.filter((err) => err !== e.target.name));
    setActivity({
      ...activity,
      [e.target.name]: e.target.value,
    });
  };

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
        <p className="text-error mb-2">
          {errors?.[0]?.message || "Maybe finish the form first"}
        </p>
      ) : null}
      {success ? <p className="text-success mb-2">Nice, got it</p> : null}
      <div className="p-5 bg-grayscale rounded-sm shadow-harsh">
        <h2 className="text-xl text-light">
          {targetActivity ? "Finish what ya started" : "What're you doin'?"}
        </h2>
        <form
          onSubmit={
            confirmTarget?.isConfirmed && confirmTarget?.target === submitter
              ? handleSubmitActivity
              : triggerConfirm
          }
          className="flex flex-col"
        >
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
            id="category"
            type="text"
            placeholder="select or add new"
            className={cx(
              "mb-4 mt-1 bg-light p-2 h-10",
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
            <FormButton
              id={targetActivity?.id || "ac"}
              type="delete"
              confirmTarget={confirmTarget}
              setSubmitter={setSubmitter}
            />
          )}
          <FormButton
            id={targetActivity?.id || "ac"}
            type={targetActivity ? "edit" : "add"}
            confirmTarget={confirmTarget}
            setSubmitter={setSubmitter}
          />
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;
