"use client";
import { FormEvent, SyntheticEvent, useState, useEffect } from "react";
import axios from "axios";
import cx from "classnames";
import { refresh_checkins } from "../actions";
import FormButton from "./FormButton";
import ConfirmSlider from "../utils/ConfirmSlider";

const CheckinForm = ({
  targetCheckin,
  emotions,
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
        updated_emotions: "",
        updated_meals: "",
      };
  const [checkin, setCheckin] = useState(initCheckin);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitter, setSubmitter] = useState("");

  useEffect(() => {
    setCheckin(targetCheckin);
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
    if (!checkin.updated_emotions && !isDelete)
      newErrors.push("updated_emotions");
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
    const dupDay = checkins?.find((wbc: any) => wbc.date === checkin.date);
    if (dupDay) {
      setErrors([{ message: "A checkin for this date already exists" }]);
      return;
    }
    const tarEmo = emotions?.find(
      (emo: any) => emo.name === checkin.updated_emotions
    );
    // TODO: This and the emotion field is kinda horse shit and needs to be updated to handle multiple emotions
    if (tarEmo) {
      bodyData = {
        ...bodyData,
        updated_emotions: `[${JSON.stringify(tarEmo)}]`,
      };
    } else {
      bodyData = {
        ...bodyData,
        updated_emotions: JSON.stringify(bodyData?.updated_emotions),
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
    if (errors.includes(e.target.name)) {
      setErrors(errors.filter((err) => err !== e.target.name));
    } else if (
      errors.some(
        (e) => e?.message === "A checkin for this date already exists"
      )
    )
      setErrors(
        errors.filter(
          (err) => err?.message !== "A checkin for this date already exists"
        )
      );
    setCheckin({
      ...checkin,
      [e.target.name]: e.target.value,
    });
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
              "mb-px mt-1 min-h-16 bg-light p-2 cursor-pointer",
              errors?.includes("notes") && "ring ring-error"
            )}
            name="notes"
            placeholder="I've never felt a negative emotion in my life"
            value={checkin?.notes}
          />
          <label
            className="mt-2 text-start text-bg-secondary"
            htmlFor="updated_emotions"
          >
            Primary emotion
          </label>
          <input
            type="text"
            placeholder="select or add new"
            className={cx(
              "mb-4 mt-1 bg-light p-2 h-10",
              errors?.includes("updated_emotions") && "ring ring-error"
            )}
            name="updated_emotions"
            value={checkin?.updated_emotions?.[0]?.name}
            onChange={handleFormInput}
            list={`updated_emotions_select-${targetCheckin?.id || ""}`}
            autoComplete="off"
          />
          <datalist id={`updated_emotions_select-${targetCheckin?.id || ""}`}>
            {emotions?.map((emo: { name: string; id: number }) => (
              <option key={emo?.id} value={emo?.name}>
                {emo?.name}
              </option>
            ))}
          </datalist>
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
