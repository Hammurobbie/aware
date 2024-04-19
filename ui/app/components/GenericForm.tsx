"use client";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import cx from "classnames";
import {
  refresh_meals,
  refresh_categories,
  refresh_emotions,
} from "../actions";
import FormButton from "./FormButton";
import ConfirmSlider from "../utils/ConfirmSlider";

const GenericForm = ({
  targetData,
  type,
  confirmTarget,
  setConfirmTarget,
}: any) => {
  const [formData, setFormData] = useState(targetData);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitter, setSubmitter] = useState("");
  const typeSingular = type === "categories" ? "category" : type.slice(0, -1);

  useEffect(() => {
    setFormData(targetData);
    setErrors([]);
  }, [targetData, setFormData, setErrors]);

  ConfirmSlider({
    confirmTarget,
    setConfirmTarget,
    targetId: `${type}_${formData?.id || type}`,
  });

  const triggerConfirm = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    const isDelete = e?.nativeEvent?.submitter?.id?.includes("delete");
    const newErrors = [];
    if (!formData.name && !isDelete) newErrors.push("name");
    if (!formData.description && targetData?.description && !isDelete)
      newErrors.push("description");
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
    const url = `http://127.0.0.1:8000/${
      type === "categories" ? "activity_categories" : type
    }`;
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

    const apiCall = submitter?.includes("delete")
      ? axios.delete(`${url}/${formData?.id}`, config)
      : targetData
      ? axios.put(`${url}/${formData?.id}`, formData, config)
      : axios.post(url, formData, config);

    const handleError = (e: any) => {
      setErrors([e]);
      setFormData(targetData);
      setConfirmTarget({ target: "", isConfirmed: false });
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    };

    apiCall
      .then(function (response) {
        if (response.status === 200) {
          setFormData(targetData);
          setSuccess(true);
          setConfirmTarget({ target: "", isConfirmed: false });
          if (type === "meals") {
            refresh_meals();
          } else if (type === "emotions") {
            refresh_emotions();
          } else refresh_categories();
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className={cx(
        "w-full text-center",
        !errors.length && !success ? "mt-8" : "",
        {
          "mb-4": targetData,
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
        <h2 className="text-xl text-light">{`Update ${type}`}</h2>
        <form
          onSubmit={
            confirmTarget?.isConfirmed && confirmTarget?.target === submitter
              ? handleSubmitActivity
              : triggerConfirm
          }
          className="flex flex-col"
        >
          <label className="mt-2 text-start text-bg-secondary" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            onChange={handleFormInput}
            type="text"
            className={cx(
              !targetData?.description
                ? "mb-4 mt-1 bg-light p-2 h-10"
                : "mb-px mt-1 bg-light p-2",
              errors?.includes("name") && "ring ring-error"
            )}
            name="name"
            autoComplete="off"
            placeholder="snorting meth"
            value={formData?.name}
          />
          {targetData?.description && (
            <>
              <label
                className="mt-2 text-start text-bg-secondary"
                htmlFor="description"
              >
                Description
              </label>
              <input
                id="description"
                onChange={handleFormInput}
                type="text"
                className={cx(
                  targetData?.description
                    ? "mb-4 mt-1 bg-light p-2 h-10"
                    : "mb-px mt-1 bg-light p-2",
                  errors?.includes("description") && "ring ring-error"
                )}
                name="description"
                autoComplete="off"
                placeholder="A tasty meal"
                value={formData?.description}
              />
            </>
          )}
          {targetData && (
            <FormButton
              id={targetData?.id}
              action={typeSingular}
              type="delete"
              confirmTarget={confirmTarget}
              setSubmitter={setSubmitter}
            />
          )}
          <FormButton
            id={targetData?.id}
            action={typeSingular}
            type={targetData ? "edit" : "add"}
            confirmTarget={confirmTarget}
            setSubmitter={setSubmitter}
          />
        </form>
      </div>
    </div>
  );
};

export default GenericForm;
