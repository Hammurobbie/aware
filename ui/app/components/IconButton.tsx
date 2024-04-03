import cx from "classnames";

import Categories from "../icons/categories";
import Emotions from "../icons/emotions";
import Meals from "../icons/meals";
import Meditating from "../icons/meditate";
import Running from "../icons/running";

export default function IconButton({
  type,
  setSelectedItem,
  setSelectedPosition,
  isSelected,
}: any) {
  const icons: any = {
    checkins: Meditating,
    activities: Running,
    meals: Meals,
    emotions: Emotions,
    categories: Categories,
  };
  const Icon = icons[type];

  const handleCategoryChange = (menuItem: string) => {
    setSelectedItem(menuItem);
    const itemEl = document?.getElementById(menuItem);
    setSelectedPosition(`calc(${itemEl?.offsetLeft}px - 8.5px)`);
  };

  return (
    <button
      className="z-10"
      id={type}
      onClick={() => handleCategoryChange(type)}
    >
      <Icon
        className={cx("adjust-icon duration-500 h-8", {
          "fill-bg": isSelected,
          "fill-grayscale": !isSelected,
        })}
      />
    </button>
  );
}
