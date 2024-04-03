import { JSXElementConstructor } from "react";
import ActivityForm from "../components/ActivityForm";
import CheckinForm from "../components/CheckinForm";

export default function UpdateFormMapper({
  data,
  categories,
  emotions,
  meals,
  type,
  confirmTarget,
  setConfirmTarget,
}: any) {
  const noData = (
    <p className="mt-44 text-dark text-center">
      {"There ain't none to update"}
    </p>
  );
  return (
    data?.map((formData: any, i: number) => {
      let Form: any;
      switch (type) {
        case "activities":
          Form = ActivityForm;
          break;
        case "checkins":
          Form = CheckinForm;
          break;
        default:
          Form = function () {
            return <div className="bg-dark h-5 w-full my-1" />;
          };
      }
      return (
        <Form
          key={i}
          targetActivity={formData}
          targetCheckin={formData}
          emotions={emotions}
          categories={categories}
          confirmTarget={confirmTarget}
          setConfirmTarget={setConfirmTarget}
        />
      );
    }) || noData
  );
}
