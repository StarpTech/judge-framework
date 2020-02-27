import { useEffect, useState } from "react";
import classNames from "classnames";

export default function Card({ card, index, onClick, style, count }) {
  const [isDisabled, setDisabled] = useState(false);
  const [isActive, setActive] = useState(false);
  const innerCardStyle = { transform: "scale(1.5)", opacity: 0.1 };
  const { title, desc, className, disabled, color, active } = card;

  useEffect(() => {
    setDisabled(disabled);
  }, [disabled]);

  useEffect(() => {
    setActive(active);
  }, [active]);

  return (
    <div
      onClick={() => onClick(card)}
      style={style}
      className={classNames(
        "m-6 relative overflow-hidden rounded-lg shadow-lg grow cursor-pointer",
        { "card--disabled": isDisabled, "card--active": isActive },
        color,
        className
      )}
    >
      <svg
        className="absolute bottom-0 left-0 mb-8"
        viewBox="0 0 375 283"
        fill="none"
        style={innerCardStyle}
      >
        <rect
          x="159.52"
          y="175"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 159.52 175)"
          fill="white"
        />
        <rect
          y="107.48"
          width="152"
          height="152"
          rx="8"
          transform="rotate(-45 0 107.48)"
          fill="white"
        />
      </svg>
      <div
        className={classNames(
          "h-32 w-full flex flex-col items-center justify-center text-white text-6xl"
        )}
      >
        <div>{index}</div>
        {count > 0 && (
          <div className="text-sm">{count === 1 ? `(${count} Vote)` : `(${count} Votes)`}</div>
        )}
      </div>

      <div className="relative text-white px-6 pb-6 mt-6">
        <div className="flex justify-between">
          <span className="block font-bold text-2xl pt-3 pb-3">{title}</span>
        </div>
        <span className="block opacity-75 -mb-1 text-gray-200">{desc}</span>
      </div>
    </div>
  );
}
