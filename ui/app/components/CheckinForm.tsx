"use client";
import { FormEvent, SyntheticEvent, useState, useEffect } from "react";
import axios from "axios";
import cx from "classnames";
import { refresh_checkins } from "../actions";
import FormButton from "./FormButton";
import ConfirmSlider from "../utils/ConfirmSlider";
import MultiItemSelect from "./MultiItemSelect";
import { BASE_URL } from "../utils/Constants";

const CheckinForm = ({
  number,
  targetCheckin,
  emotions,
  meals,
  checkins,
  confirmTarget,
  setConfirmTarget,
}: any) => {
  const initCheckin = targetCheckin
    ? targetCheckin
    : {
        date: toDateInputValue(new Date()),
        notes: "",
        is_intermittent_fasting: false,
        updated_emotions: [],
        updated_meals: [],
      };
  const [checkin, setCheckin] = useState(initCheckin);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitter, setSubmitter] = useState("");
  const mealsId = `meals-select-${number}`;
  const emotionsId = `emotions-select-${number}`;

  useEffect(() => {
    if (targetCheckin) setCheckin(targetCheckin);
  }, [targetCheckin, setCheckin]);

  ConfirmSlider({
    confirmTarget,
    setConfirmTarget,
    targetId: `wb_${checkin?.id || "wb"}`,
  });

  const triggerConfirm = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const isDelete = e?.nativeEvent?.submitter?.id?.includes("delete");
    const newErrors = [];
    if (!checkin.date && !isDelete) newErrors.push("date");
    if (!checkin.notes && !isDelete) newErrors.push("notes");
    if (!checkin.updated_emotions.length && !isDelete)
      newErrors.push("updated_emotions");
    if (!checkin.updated_meals.length && !isDelete)
      newErrors.push("updated_meals");
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
    const url = `${BASE_URL}wellbeing_checks`;
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
    let bodyData = { ...checkin };
    const dupDay = checkins?.find((wbc: any) => wbc.date === checkin.date);
    if (dupDay) {
      setErrors([{ message: "A checkin for this date already exists" }]);
      return;
    }

    bodyData.updated_emotions = JSON.stringify(bodyData?.updated_emotions);
    bodyData.updated_meals = JSON.stringify(bodyData?.updated_meals);

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
    const isMeals = e.target.name === "updated_meals";
    const isEmotions = e.target.name === "updated_emotions";
    if (errors.includes(e.target.name)) {
      setErrors(errors.filter((err) => err !== e.target.name));
    } else if (
      errors.some(
        (e) => e?.message === "A checkin for this date already exists"
      )
    ) {
      setErrors(
        errors.filter(
          (err) => err?.message !== "A checkin for this date already exists"
        )
      );
    }
    if (isMeals || isEmotions) {
      const tarSelect = document?.getElementById(
        isEmotions ? emotionsId : mealsId
      ) as HTMLSelectElement;
      const tarProperty = isEmotions ? "updated_emotions" : "updated_meals";
      const tarList = isEmotions ? emotions : meals;
      let updatedTars =
        (isEmotions ? checkin?.updated_emotions : checkin?.updated_meals) ?? [];
      const selectedTar = updatedTars.find(
        (t: any) => t?.name === e.target.value
      );
      const newTar = tarList?.find((t: any) => t?.name === e.target.value);
      if (selectedTar) {
        updatedTars = updatedTars.filter(
          (m: any) => m?.name !== e.target.value
        );
      } else updatedTars.push(newTar);
      setCheckin({
        ...checkin,
        [tarProperty]: updatedTars,
      });
      if (tarSelect) tarSelect.value = "select";
    } else {
      setCheckin({
        ...checkin,
        [e.target.name]: e.target.value,
      });
    }
  };

  function toDateInputValue(dateObject: Date) {
    const local = new Date(dateObject);
    local.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
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
          <label className="mt-2 text-start text-bg-secondary" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            onChange={handleFormInput}
            type="date"
            className={cx(
              "mb-px mt-1 bg-light p-2",
              errors?.includes("date") && "ring ring-error"
            )}
            name="date"
            value={checkin?.date}
          />
          <label className="mt-2 text-start text-bg-secondary" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            onChange={handleFormInput}
            className={cx(
              "mb-px mt-1 min-h-16 bg-light p-2",
              errors?.includes("notes") && "ring ring-error"
            )}
            name="notes"
            placeholder="I've never felt a negative emotion in my life"
            value={checkin?.notes}
          />
          <MultiItemSelect
            errors={errors}
            emotions={emotions}
            handleFormInput={handleFormInput}
            emotionsId={emotionsId}
            checkin={checkin}
          />
          <MultiItemSelect
            errors={errors}
            meals={meals}
            handleFormInput={handleFormInput}
            mealsId={mealsId}
            checkin={checkin}
          />
          {targetCheckin && (
            <FormButton
              id={targetCheckin?.id || "wb"}
              type="delete"
              action="check in"
              confirmTarget={confirmTarget}
              setSubmitter={setSubmitter}
            />
          )}
          <FormButton
            id={targetCheckin?.id || "wb"}
            type={targetCheckin ? "edit" : "add"}
            action="check in"
            confirmTarget={confirmTarget}
            setSubmitter={setSubmitter}
          />
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;
