import MQTT from "async-mqtt";
import { useClipboard } from "use-clipboard-copy";
import nanoid from "nanoid/generate";
import Head from "next/head";
import nolookalikes from "nanoid-dictionary/nolookalikes";
import { useEffect, useState, useRef } from "react";
import Card from "../components/card";
import allCards from "../lib/cards";
import { getUrlParam, mapToJson, jsonToMap } from "../lib/helper";
import { NextSeo } from "next-seo";

function genId() {
  return nanoid(nolookalikes, 12);
}

export default function Index() {
  const [cards, setCards] = useState(() => allCards);
  const [status, setStatus] = useState("");
  const clipboard = useClipboard({
    copiedTimeout: 2000 // timeout duration in milliseconds
  });

  const groupIDRef = useRef("");
  const isModeratorRef = useRef(false);
  const topicRef = useRef("");
  const clientRef = useRef(null);
  const [decisionMap, setDecisionMap] = useState(() => new Map());
  const [userVotesMap] = useState(() => new Map());
  const [userId] = useState(() => genId());

  const handleShare = () => {
    const link = `${process.env.DOMAIN}${process.env.ROOT_PATH}?g=${groupIDRef.current}`;
    clipboard.copy(link);
    localStorage.setItem("masterOfGroupVoteID", groupIDRef.current);
  };

  useEffect(() => {
    isModeratorRef.current =
      localStorage.getItem("masterOfGroupVoteID") === getUrlParam("g") ||
      !getUrlParam("g");

    const client = MQTT.connect("ws://broker.hivemq.com:8000/mqtt");

    const groupID = getUrlParam("g") || genId();
    const topic = "judgeframework1.0/" + groupID;
    const updatesTopic = `${topic}/updates`;

    groupIDRef.current = groupID;
    topicRef.current = topic;

    const acceptDecisions = async () => {
      console.log("Starting");

      try {
        await client.subscribe(topic, {
          qos: 1
        });
        await client.subscribe(updatesTopic, {
          qos: 1
        });
        console.log("Subscription created! Topic: " + topic);

        client.on("message", async (t, message) => {
          if (topic === t) {
            const [clientId, decision] = message.toString().split(";");

            // check if client has already voted
            if (userVotesMap.has(clientId)) {
              console.log(`client with id ${clientId} has voted already!`);
              return;
            }

            const card = cards.find(c => c.title === decision);

            if (card) {
              console.log("New vote received", decision);
              const lastCount = (decisionMap.get(decision) || 0) + 1;
              decisionMap.set(decision, lastCount);
              userVotesMap.set(clientId, true);
              console.log("Participants", userVotesMap.keys());
            }
            setCards([...cards]);

            // update all other clients and retain the message with the latest voting state
            // so all new clients will receive the last state
            await clientRef.current.publish(
              updatesTopic,
              mapToJson(decisionMap),
              { retain: true }
            );
          } else if (t === updatesTopic) {
            const newDecisionMap = jsonToMap(message.toString());
            console.log("Receive map update", newDecisionMap);

            // update map only when value has increased to be safe for out of order messages
            for (const [key, value] of newDecisionMap.entries()) {
              if (decisionMap.has(key)) {
                if (newDecisionMap.get(key) > decisionMap.get(key)) {
                  decisionMap.set(newDecisionMap.get(key));
                }
              } else {
                decisionMap.set(key, value);
              }
            }
            // update decision map to be up-to-date
            setDecisionMap(decisionMap);
            setCards([...cards]);
          }
        });
      } catch (e) {
        setStatus("Error! Please refresh!");
        console.log(e);
      }
    };

    setStatus("Connecting...");

    client.on("connect", a => {
      setStatus("Connected!");

      acceptDecisions();
    });
    client.on("reconnect", () => {
      setStatus("Reconnecting...");
    });
    client.on("disconnect", () => {
      setStatus("Disconnected...");
    });
    client.on("close", () => {
      setStatus("Closed!");
    });
    client.on("error", err => {
      setStatus("Error! Please refresh!");
      console.log(err);
    });

    clientRef.current = client;
  }, []);

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

  const handleCardClick = async current => {
    if (localStorage.getItem("lastGroupVoteID") === groupIDRef.current) {
      alert("You can't vote twice! Ask the moderator if it's done.");
      return;
    }
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.title === current.title) {
        card.active = true;
      } else {
        card.active = false;
      }
    }
    setCards([...cards]);

    const r = confirm(`You want to select '${current.title}' ?`);
    if (r !== true) {
      return;
    }

    console.log(`Publish to topic ${topicRef.current}`);

    await clientRef.current.publish(
      topicRef.current,
      [userId, current.title].join(";")
    );

    // await clientRef.current.unsubscribe(topicRef.current);

    localStorage.setItem("lastGroupVoteID", groupIDRef.current);
  };

  return (
    <div className="mx-auto">
      <NextSeo
        title="JUDGE - Just an Ultimate Decision Guide"
        description="JUDGE - Just an Ultimate Decision Guide"
        canonical={process.env.DOMAIN}
      />
      <div>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,700,900&display=swap"
            rel="stylesheet"
          />
          {/*<!-- Global site tag (gtag.js) - Google Analytics -->*/}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-159316068-1"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'UA-159316068-1');
              `
            }}
          />
        </Head>

        <header>
          <nav className="flex items-center justify-between flex-wrap bg-gray-700 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              <svg
                height="35pt"
                viewBox="-64 0 512 512"
                width="35pt"
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
              <span className="font-semibold text-xl tracking-tight ml-3">
                JUDGE Framework
              </span>
            </div>
            <div className="w-full flex-grow lg:flex lg:items-center lg:w-auto">
              {isModeratorRef.current && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 ml-3 lg:mt-0"
                  onClick={handleShare}
                >
                  Copy link
                </button>
              )}
              <div className="text-sm lg:flex-grow">
                <span className="block mt-4 lg:inline-block lg:mt-0 text-green-500 ml-3">
                  {clipboard.copied ? "Copied!" : null}
                </span>
                {groupIDRef.current && (
                  <span className="block mt-4 lg:inline-block lg:mt-0 text-white ml-3">
                    <b>Session:</b> {groupIDRef.current}
                  </span>
                )}
                <span className="block mt-4 lg:inline-block lg:mt-0 text-white ml-3">
                  <b>State:</b> {status}
                </span>
              </div>
              <div className="ml-3 mt-3 lg:mt-0">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=starptech&repo=judge-framework&type=star&count=true&size=large"
                  frameBorder="0"
                  scrolling="0"
                  width="160px"
                  height="30px"
                />
              </div>
            </div>
          </nav>
        </header>

        {isModeratorRef.current && (
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
                  <div className="text-sm">
                    JUDGE – Just an Ultimate Decision Guide
                    <br /> is a tool to express your insecurity in a way that
                    others can understand.
                    <br />
                    <br />
                    <ul className="list-disc">
                      <li>
                        <b>Consensus 0-2:</b> Does not require agreement,
                        affirmation or even preference.
                      </li>
                      <li>
                        <b>Consent 0-4:</b> Members don’t “block” decisions.
                      </li>
                      <li>
                        <b>Decision is blocked 5-6:</b> Members can't follow the
                        proposal or don't wish to attend.
                      </li>
                    </ul>
                    <br />
                    <div className="text-right">
                      <a
                        className="text-gray-600"
                        target="_blank"
                        href="http://mytoysdevblog.wpengine.com/index.php/2018/06/28/die-magie-von-gruppenentscheidungen/"
                      >
                        Blog post (German)
                      </a>
                      <span className="text-gray-600"> | </span>
                      <a
                        className="text-gray-600"
                        target="_blank"
                        href="https://www.youtube.com/watch?v=t4eVn_MxOUQ"
                      >
                        Video (German)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModeratorRef.current && (
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
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-1">
          {cards.map((card, index) => {
            const count = decisionMap.get(card.title);
            let total = 0;

            for (var value of decisionMap.values()) {
              total += value;
            }

            let val = 0;
            if (total > 0 && count > 0) {
              val = Math.round((100 / total) * count);
            }

            const cardStyle = {
              background: `linear-gradient(90deg, rgb(136, 136, 136), ${val}%, ${card.color} 0%)`
            };

            if (total > 0) {
              cardStyle.background = `linear-gradient(90deg, ${card.color}, ${val}%, rgb(136, 136, 136) 0%)`;
            }

            return (
              <Card
                key={card.title}
                onClick={handleCardClick}
                style={cardStyle}
                index={index}
                card={card}
                count={count}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="text-xs text-center text-teal-900 mt-5">
          © 2020{" "}
          <a
            href="https://dynabase.de/"
            className="text-gray-800"
            target="_blank"
          >
            developed by dynabase
          </a>{" "}
          <div className="text-gray-500">
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
