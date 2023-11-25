import {useState, useEffect} from 'react'

const App = () => {
  const [value, setValue] = useState(null)
  const [ message, setMessage ] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setcurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setcurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setcurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  } 

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
     }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:8000/completions", options)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setcurrentTitle(value)
    }
    else if (currentTitle && value && message) {
      setPreviousChats(previousChats => (
        [...previousChats,
          {
            title: currentTitle,
            role:"you",
            content: value
          },
          {
           title: currentTitle,
           role: message.role,
           content: message.content 
          }]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat  </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Mark</p>
        </nav>
      </section>
      <section className="main">
        { !currentTitle && <h1>MarkGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="button-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            This is powered by ChatGPT-4. The purpose of MarkGPT is showcasing 
            that the creator is capable of creating applications using other companies' API.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
