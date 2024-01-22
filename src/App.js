import "./App.css";
import logo from "./assets/logo.png";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

function App() {
  const defaultOneChat = [
    '',
    'user',
  ];
  const number = [];
  for (let i = 0; i < 10000; i++) number[i] = i;
  const defaultHistory = number.map(i => defaultOneChat);
  const [chatHistory, setChatHistory] = useState(defaultHistory);
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState([]);
  const [length, setLength] = useState(0);
  const [message, setMessage] = useState('');
  const [isUserInput, setIsUserInput] = useState(false);
  const divRef = useRef();

  const handleChange = event => {
    setMessage(event.target.value);
  }
  const handleEnter = () => {
    const newChatHistory = [...chatHistory];
    newChatHistory[length] = [message, 'user'];
    setChatHistory(newChatHistory)
    setLength(length + 1)
    setIsUserInput(true)
    setIsLoading(true)
  };
  const getAnswer = async () => {
    const response = await axios.post("http://localhost:8000/api/get-answer", { question: message });
    setMessage("")
    const newChatHistory = [...chatHistory];
    newChatHistory[length] = [response.data.message, 'bot']
    setChatHistory(newChatHistory)
    setLength(length + 1)

    setIsUserInput(false)
    setIsLoading(false)

  }
  useEffect(() => {
    if (isUserInput === false) return;
    const startAnswer = async () => {
      await getAnswer();
    }
    startAnswer();
  }, [isUserInput])

  useEffect(() => {
    divRef.current != null &&
      divRef.current.scrollTo({
        behavior: 'smooth',
        left: -divRef.current?.scrollWidth,
        top: divRef.current.scrollHeight,
      })
  }, [chatHistory])

  const uploadFile = (e) => {
    const formData = new FormData();
    for(let i = 0; i< e.target.files.length;i++)
      formData.append('file', e.target.files[i]);
    const newFileNames = []
    for (let i = 0; i < e.target.files.length; i++)
      newFileNames[i] = e.target.files[i].name;

    setFileName(newFileNames);
    setIsLoading(true)
    axios
      .post("http://localhost:8000/api/get-file-analysis", formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
      .then((response) => {
        console.log(response.data.message);
        setIsLoading(false)
        const newChatHistory = [...chatHistory];
        newChatHistory[length] = [
          response.data.message,
          'bot'
        ]
        setChatHistory(newChatHistory);
        setLength(length + 1)
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="bg-[#ececec] h-[100vh] py-20 px-12">
      <div className="flex border-t-2 border-t-[#e1e1e1]">
        <div className="flex flex-col px-4 w-[30%] border-r-2 border-r-[#e1e1e1]">
          <div className="flex w-full justify-center border-b-2 border-b-[#e1e1e1] py-6">
            <img src={logo} alt="logo" className="w-[40%]" />
          </div>
          <div className="flex flex-col w-full border-b-2 border-b-[#e1e1e1] py-6">
            <p className="font-bold">Instructions</p>
            <textarea
              className="my-2 px-2 py-1 bg-transparent border-[#e1e1e1] border-2 rounded-lg"
              type="text"
              rows="4"
              placeholder="You are a helpful assistant."
              spellcheck="false"
            ></textarea>
          </div>
          <div className="flex flex-col w-full border-b-2 border-b-[e1e1e1] py-6">
            <p className="font-bold">Upload Files for Analysis</p>
            <div className="mt-3 px-1">
              <div className="border-2 border-[#e1e1e1] p-1 rounded-md w-fit">
                {fileName.map(i => (<p>{i}</p>))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 w-[70%] relative h-[95vh]">
          <div className="flex justify-end w-full py-2 gap-4">
            <button className="bg-[#DBDCE1] flex justify-center items-center px-4 py-2 rounded-lg w-fit">
              <span className="btn-node">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#000"
                    fill-rule="evenodd"
                    d="M20.707 4.707a1 1 0 0 0-1.414-1.414L14.5 8.086l-.633-.634a3 3 0 0 0-3.786-.375l-7.636 5.09a1 1 0 0 0-.152 1.54l8 8a1 1 0 0 0 1.54-.152l5.09-7.636a3 3 0 0 0-.375-3.786l-.634-.633 4.793-4.793ZM11.19 8.742a1 1 0 0 1 1.262.124l2.681 2.682a1 1 0 0 1 .126 1.261l-.414.621-4.275-4.275.62-.413Zm-2.317 1.545L4.57 13.155 6 14.585l1.293-1.292a1 1 0 0 1 1.414 1.414L7.414 16l3.43 3.43 2.87-4.303-4.841-4.84Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
              Clear
            </button>
            <button className="bg-[#DBDCE1] flex justify-center items-center px-4 py-2 rounded-lg w-fit">
              Logs
              <span className="btn-node">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  height="18px"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2V5h2Zm-4 0v14H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h8Zm7 1a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
          {/* Logs */}
          <div className="flex flex-col px-6 py-2 gap-4 h-[60vh] w-full overflow-y-auto" ref={divRef}>
            {chatHistory.map(
              i =>
                i[0] !== '' && (i[1] === 'user' ? (<div className="flex flex-col">
                  <p className="font-bold">User</p>
                  <p className="whitespace-pre-line">{i[0]}</p>
                </div>) : (<div className="flex flex-col">
                  <p className="font-bold">ADAPT AI</p>
                  <p className="whitespace-pre-line">{i[0]}</p>
                </div>
                ))
            )}
            {isLoading && (<div>Loading...</div>)}

          </div>

          {/* Input */}
          <div className="w-full border-[#e1e1e1] border-2 h-64 rounded-lg bottom-10 px-6 py-4 mt-4">
            <textarea
              type="text"
              className="w-full h-[60%] bg-transparent text-start focus:outline-none"
              placeholder="I am here to assist you. Let me know how I can help..."
              value={message}
              disabled={isLoading}
              onChange={handleChange}
            />
            <div className="flex justify-between">
              <input type="file" onChange={uploadFile} disabled={isLoading} multiple='multiple' />
              <button
                className="bg-[#A038EF] text-white w-[80px] h-[30px] rounded-lg"
                onClick={handleEnter}
                disabled={isLoading}
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
