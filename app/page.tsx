"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  type: "user" | "bot";
  text: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<Message[]>([]);

  const sendMessage = async () => {
    try {
      const res = await axios.post("/api/chat", { message });
      setMessage("");
      setResponse((prevResponses) => [
        ...prevResponses,
        { type: "bot", text: res.data.message },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitTextArea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        setResponse((prevResponses) => [
          ...prevResponses,
          { type: "user", text: message },
        ]);
        sendMessage();
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center" >
      <div className="grow flex text-white items-end w-full ">
        <div className="flex flex-col gap-4 mb-4 w-full overflow-y-auto h-[calc(100vh-10rem)] mt-4">
          {response.map((res, index) => (
            <div key={index} className={'flex justify-end w-full ' + (res.type === "user" ? "justify-end" : "justify-start") + " "} >
              <p
                className={
                  "rounded-md w-auto px-4 py-2 " +
                  (res.type === "user" ? "text-right bg-green-500" : "text-left ") +
                  " "
                }
              >
                {res.text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <form
        className="mb-4 grid w-full gap-2 sticky bottom-3"
      >
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full"
          onKeyDown={handleSubmitTextArea}
        ></Textarea>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            if (message.trim()) {
              setResponse((prevResponses) => [
                ...prevResponses,
                { type: "user", text: message },
              ]);
              sendMessage();
            }
          }}
        >
          Send
        </Button>
      </form>
    </main>
  );
}
