import classNames from "classnames";
import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";

function Card({ card, index, onClick }) {
  const [isDisabled, setDisabled] = useState(false);
  const [isActive, setActive] = useState(false);
  const style = { transform: "scale(1.5)", opacity: 0.1 };
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
        style={style}
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
          "h-32 w-full flex items-center justify-center text-white text-6xl"
        )}
      >
        {index}
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

const allCards = [
  {
    color: "bg-blue-700",
    title: "step aside",
    desc:
      "I step aside, I support the groups decision and don't need to be involved.",
    className: "border-b-4 border-solid border-blue-600"
  },

  {
    color: "bg-green-400",
    title: "full support",
    desc: "I really like it. It's great and it works like a charm for me.",
    className: "border-b-4 border-solid border-green-300"
  },

  {
    color: "bg-green-900",

    title: "slight concerns",
    desc:
      "I have some slight concerns but I can live with it. I'll support the group actively.",
    className: "border-b-4 border-solid border-green-800"
  },

  {
    color: "bg-pink-700",
    title: "severe concerns",
    desc:
      "Not perfect it's good enough. I disagree with a few points. But I'll support the group.",
    className: "border-b-4 border-solid border-pink-600"
  },
  {
    color: "bg-orange-500",
    title: "step out",
    desc:
      "Disagreements are so serious that I'm not willing to support this decision actively. Group can still continue but without my involvement.",
    className: "border-b-4 border-solid border-orange-400"
  },

  {
    color: "bg-yellow-700",
    title: "need to talk",
    desc:
      "I don't understand the proposal and / or I need more discussion before I can support this decision.",
    className: "border-b-4 border-solid border-yellow-600"
  },

  {
    color: "bg-red-700",
    title: "veto",
    desc:
      "I understand the proposal but do not support it! I can explain my concerns.",
    className: "border-b-4 border-solid border-red-700"
  }
];

export default function Index() {
  const [cards, setCards] = useState(() => allCards);

  const handleRangeClick = (start, end) => {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (i >= start && i <= end) {
        card.disabled = false;
      } else {
        card.disabled = true;
      }
    }
    setCards([...cards]);
  };

  const handleCardClick = current => {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.title === current.title) {
        card.active = true;
      } else {
        card.active = false;
      }
    }
    setCards([...cards]);
  };

  return (
    <div className="mx-auto p-4">
      <NextSeo
        title="JUDGE - Just an Ultimate Decision Guide"
        description="JUDGE - Just an Ultimate Decision Guide"
      />
      <div className="">
        <link
          href="https://fonts.googleapis.com/css?family=Lato:400,700,900&display=swap"
          rel="stylesheet"
        />
        <header className="flex mt-6 mb-6 pb-6 justify-center">
          <svg
            height="64pt"
            viewBox="-64 0 512 512"
            width="64pt"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m368.464844 512h-353.464844c-4.824219 0-9.351562-2.316406-12.167969-6.230469-2.8203122-3.910156-3.585937-8.9375-2.0625-13.511719l36.800781-110.402343c18.472657-55.417969 70.128907-92.65625 128.546876-92.65625h51.230468c58.417969 0 110.074219 37.238281 128.546875 92.65625l36.804688 110.402343c1.523437 4.574219.757812 9.601563-2.0625 13.511719-2.820313 3.914063-7.347657 6.230469-12.171875 6.230469zm0 0"
              fill="#324150"
            />
            <path
              d="m380.632812 505.769531c2.820313-3.910156 3.585938-8.9375 2.0625-13.511719l-36.800781-110.402343c-18.472656-55.417969-70.128906-92.65625-128.546875-92.65625h-25.617187v222.800781h176.734375c4.824218 0 9.351562-2.316406 12.167968-6.230469zm0 0"
              fill="#23303c"
            />
            <path
              d="m266.605469 357.859375-64.265625-64.265625c-5.859375-5.859375-15.355469-5.859375-21.214844 0l-64.265625 64.265625c-5.058594 5.054687-5.84375 12.980469-1.875 18.925781l32.132813 48.203125c2.492187 3.738281 6.53125 6.164063 11.003906 6.605469 4.476562.441406 8.90625-1.144531 12.082031-4.320312l21.527344-21.527344 21.527343 21.527344c3.179688 3.179687 7.609376 4.765624 12.085938 4.320312 4.472656-.441406 8.511719-2.867188 11.003906-6.605469l32.132813-48.203125c3.964843-5.945312 3.179687-13.871094-1.875-18.925781zm0 0"
              fill="#f0f2f4"
            />
            <path
              d="m225.34375 431.59375c4.472656-.441406 8.511719-2.867188 11.003906-6.605469l32.132813-48.199219c3.964843-5.949218 3.179687-13.871093-1.875-18.929687l-64.265625-64.265625c-2.929688-2.929688-6.769532-4.394531-10.609375-4.394531v116.546875l21.527343 21.527344c3.179688 3.179687 7.609376 4.765624 12.085938 4.320312zm0 0"
              fill="#dee1e5"
            />
            <path
              d="m63.199219 287.066406c-25.988281 0-47.132813-21.144531-47.132813-47.132812 0-25.988282 21.144532-47.132813 47.132813-47.132813s47.132812 21.144531 47.132812 47.132813c0 25.988281-21.144531 47.132812-47.132812 47.132812zm0 0"
              fill="#cbcfd7"
            />
            <path
              d="m320.265625 287.066406c-25.988281 0-47.132813-21.144531-47.132813-47.132812 0-25.988282 21.144532-47.132813 47.132813-47.132813s47.132813 21.144531 47.132813 47.132813c0 25.988281-21.144532 47.132812-47.132813 47.132812zm0 0"
              fill="#b9bec8"
            />
            <path
              d="m63.199219 222.800781c-25.988281 0-47.132813-21.144531-47.132813-47.132812s21.144532-47.136719 47.132813-47.136719 47.132812 21.148438 47.132812 47.136719-21.144531 47.132812-47.132812 47.132812zm0 0"
              fill="#dee1e5"
            />
            <path
              d="m320.265625 222.800781c-25.988281 0-47.132813-21.144531-47.132813-47.132812s21.144532-47.136719 47.132813-47.136719 47.132813 21.148438 47.132813 47.136719-21.144532 47.132812-47.132813 47.132812zm0 0"
              fill="#cbcfd7"
            />
            <path
              d="m191.730469 319.199219c-61.429688 0-111.398438-49.964844-111.398438-111.382813v-64.285156c0-8.28125 6.714844-15 15-15h192.800781c8.285157 0 15 6.71875 15 15v64.269531c0 61.515625-49.769531 111.398438-111.402343 111.398438zm0 0"
              fill="#ffdcc8"
            />
            <path
              d="m303.132812 207.800781v-64.269531c0-8.28125-6.714843-15-15-15h-96.402343v190.667969c61.632812 0 111.402343-49.882813 111.402343-111.398438zm0 0"
              fill="#ffc3b4"
            />
            <path
              d="m320.265625 158.53125h-257.066406c-8.285157 0-15-6.714844-15-15 0-79.140625 64.386719-143.53125 143.53125-143.53125 79.148437 0 143.535156 64.390625 143.535156 143.53125 0 8.285156-6.714844 15-15 15zm0 0"
              fill="#f0f2f4"
            />
            <path
              d="m335.265625 143.53125c0-79.140625-64.390625-143.53125-143.535156-143.53125v158.53125h128.535156c8.285156 0 15-6.714844 15-15zm0 0"
              fill="#dee1e5"
            />
          </svg>
          <h1 className="border-b-2 border-dotted text-5xl pl-3">
            JUDGE Framework
          </h1>
        </header>

        <div className="md:flex mt-6 mb-6 pb-6 justify-center">
          <div
            className="bg-teal-lightest border-t-4 border-teal rounded-b text-teal-darkest px-4 py-3 shadow-md my-2 max-w-2xl"
            role="alert"
          >
            <div className="flex">
              <svg
                className="h-6 w-6 text-teal mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
              <div>
                <p className="font-bold">What is JUDGE?</p>
                <p className="text-sm">
                  JUDGE – Just an Ultimate Decision Guide
                  <br /> is a tool to express your insecurity in a way that
                  others can understand.
                  <br />
                  <br />
                  <ul className="list-disc">
                    <li>
                      <b>Consensus 0-2:</b> Members don’t “block” decisions and
                      don't waste time debating or trying to persuade other
                      members to minimize their objections.
                    </li>
                    <li>
                      <b>Consent 0-4:</b> Does not require agreement,
                      affirmation or even preference because there are no
                      significant objections to a policy.
                    </li>
                    <li>
                      <b>Decision is blocked 5-6:</b> Members can't follow the
                      proposal or don't want to take action.
                    </li>
                  </ul>
                  <br />
                  <div className=" text-right">
                    <a
                      className="text-red-800"
                      href="http://mytoysdevblog.wpengine.com/index.php/2018/06/28/die-magie-von-gruppenentscheidungen/"
                    >
                      Blog post (German)
                    </a>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-6 mb-6 pb-6 justify-center">
          <ul className="flex justify-between text-xl flex-col sm:flex-row">
            <li className="mr-2">
              <a
                className="text-center block border border-white rounded hover:border-gray-200 text-gray-700 hover:bg-gray-200 py-2 px-4"
                href="#"
                onClick={() => handleRangeClick(0, 6)}
              >
                All
              </a>
            </li>
            <li className="mr-2">
              <a
                className="text-center block border border-white rounded hover:border-gray-200 text-gray-700 hover:bg-gray-200 py-2 px-4"
                href="#"
                onClick={() => handleRangeClick(0, 2)}
              >
                0-2 Consensus
              </a>
            </li>
            <li className="mr-2">
              <a
                className="text-center block border border-white rounded hover:border-gray-200 text-gray-700 hover:bg-gray-200 py-2 px-4"
                href="#"
                onClick={() => handleRangeClick(0, 4)}
              >
                0-4 Consent
              </a>
            </li>
            <li className="text-center">
              <a
                className="text-center block border border-white rounded hover:border-gray-200 text-gray-700 hover:bg-gray-200 py-2 px-4"
                href="#"
                onClick={() => handleRangeClick(5, 6)}
              >
                5-6 Decision is blocked
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-1">
          {cards.map((card, index) => {
            return (
              <Card
                key={index.toString()}
                onClick={handleCardClick}
                index={index}
                card={card}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-xs text-center text-teal-900  mt-5 ">
          © 2020 <a href="https://dynabase.de/">developed by dynabase</a>{" "}
          <div>
            Icons created by{" "}
            <a
              href="https://www.flaticon.com/de/autoren/freepik"
              title="Freepik"
            >
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/de/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
