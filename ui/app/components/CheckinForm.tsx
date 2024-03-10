"use client";
import { FormEvent, SyntheticEvent, useState } from "react";
import axios from "axios";
import cx from "classnames";
import { refresh_checkins } from "../actions";
import FormButton from "./FormButton";
import ConfirmSlider from "../utils/ConfirmSlider";

const CheckinForm = ({
  targetCheckin,
  emotions,
  confirmTarget,
  setConfirmTarget,
}: any) => {
  const initCheckin = targetCheckin
    ? {
        ...targetCheckin,
        stop: toLocalISOString(new Date()),
      }
    : {
        name: "",
        start: toLocalISOString(new Date()),
        stop: "",
        category: "",
        category_id: "",
      };
  const [checkin, setCheckin] = useState(initCheckin);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitter, setSubmitter] = useState("");

  ConfirmSlider({ confirmTarget, setConfirmTarget, targetId: checkin?.id });

  const triggerConfirm = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const newErrors = [];
    if (!checkin.name) newErrors.push("name");
    if (!checkin.category) newErrors.push("category");
    if (targetCheckin && !checkin.start) newErrors.push("start");
    if (targetCheckin && !checkin.stop) newErrors.push("stop");
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
    const url = "http://127.0.0.1:8000/wellbeing_checks";
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
    let bodyData = checkin;
    const tarEmo = emotions?.find((cat: any) => cat.name === checkin.category);
    if (tarEmo) {
      bodyData = {
        ...bodyData,
        category_id: tarEmo.id,
        category: "",
      };
    }

    const apiCall = submitter?.includes("delete")
      ? axios.delete(`${url}/${bodyData?.id}`, config)
      : targetCheckin
      ? axios.put(`${url}/${bodyData?.id}`, bodyData, config)
      : axios.post(url, bodyData, config);

    const handleError = (e: any) => {
      setErrors([e]);
      setCheckin(initCheckin);
      setConfirmTarget({ target: "", isConfirmed: false });
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    };

    apiCall
      .then(function (response) {
        if (response.status === 200) {
          setCheckin(initCheckin);
          setSuccess(true);
          setConfirmTarget({ target: "", isConfirmed: false });
          refresh_checkins();
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
    setCheckin({
      ...checkin,
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
          "mb-4": targetCheckin,
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
          {targetCheckin ? "Change how you're doin" : "How're you doin'?"}
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
            value={checkin?.name}
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
            value={checkin?.start}
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
            value={checkin?.stop}
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
              "mb-4 mt-1 bg-light p-2 h-10",
              errors?.includes("category") && "ring ring-error"
            )}
            name="category"
            value={checkin?.category}
            onChange={handleFormInput}
            list={`category_select-${targetCheckin?.id || ""}`}
            autoComplete="off"
          />
          <datalist id={`category_select-${targetCheckin?.id || ""}`}>
            {emotions?.map((cat: { name: string; id: number }) => (
              <option key={cat?.id} value={cat?.name}>
                {cat?.name}
              </option>
            ))}
          </datalist>
          {targetCheckin && (
            <FormButton
              id={targetCheckin?.id || checkin?.id}
              type="delete"
              confirmTarget={confirmTarget}
              setSubmitter={setSubmitter}
            />
          )}
          <FormButton
            id={targetCheckin?.id || checkin?.id}
            type={targetCheckin ? "edit" : "add"}
            confirmTarget={confirmTarget}
            setSubmitter={setSubmitter}
          />
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;
