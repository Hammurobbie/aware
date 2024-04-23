import ActivityForm from "../components/ActivityForm";
import CheckinForm from "../components/CheckinForm";
import GenericForm from "../components/GenericForm";

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
          Form = GenericForm;
      }
      return (
        <Form
          key={i}
          type={type}
          targetActivity={formData}
          targetCheckin={formData}
          targetData={formData}
          emotions={emotions}
          meals={meals}
          categories={categories}
          confirmTarget={confirmTarget}
          setConfirmTarget={setConfirmTarget}
        />
      );
    }) || noData
  );
}
