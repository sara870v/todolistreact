import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

const baseURL = "https://todolist-8cdd.restdb.io/rest/todolost";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "x-apikey": "5d90d71c1ce70f637985513f",
  "cache-control": "no-cache"
};

function Header(props) {
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState("");
  const [time, setTime] = useState("");

  const nameChanged = e => {
    setName(e.target.value);
  };

  const tasksChanged = e => {
    setTasks(e.target.value);
  };

  const timeChanged = e => {
    setTime(e.target.value);
  };
  const onSubmit = e => {
    e.preventDefault();

    fetch(baseURL, {
      method: "post",
      headers: headers,
      body: JSON.stringify({
        name: name,
        tasks: tasks,
        time: time
      })
    })
      .then(e => e.json())
      .then(e => {
        console.log(e);
        props.onTaskAdded(e);
        setName("");
        setTasks("");
        setTime("");
      });
  };
  return (
    <>
      <header className="head">Add things to do to your list</header>
      <Profile name={props.name} />

      <form className="formof" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={name} onChange={nameChanged} size="25" placeholder="Sarah Davidsen" required />

        <label htmlFor="tasks">Tasks</label>
        <input type="text" name="tasks" value={tasks} onChange={tasksChanged} size="25" placeholder="Make to do list" required />

        <label htmlFor="time">Time left(in days)</label>
        <input type="number" name="time" value={time} onChange={timeChanged} size="25" placeholder="1" required />

        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

function Profile(props) {
  return <p>Profile {props.name} </p>;
}

function Footer(props) {
  return (
    <>
      <footer className="foot">This is a footer for {props.name}</footer>
    </>
  );
}

function Task(props) {
  return (
    <article>
      <h1>{props.name}</h1>
      <p>{props.tasks}</p>
      <p>{props.time}:days</p>
      <button
        onClick={() => {
          props.deleteTask(props.id);
        }}
      >
        Delete me
      </button>
    </article>
  );
}

function App() {
  const name = "Sarah"; //pass to profile
  // const posts = [<Post />]; //pass this to feed
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(baseURL, {
      method: "get",
      headers: headers
    })
      .then(e => e.json())
      .then(e => setPosts(e));
  }, []);
  const onTaskAdded = data => {
    setPosts(posts.concat(data));
  };
  const copy = [...posts];
  copy.sort(function(a, b) {
    return a.time - b.time;
  });

  const deleteTask = id => {
    console.log(id);
    const newPosts = posts.filter(post => {
      if (post._id != id) {
        return post;
      }
    });
    setPosts(newPosts);

    fetch(baseURL + "/" + id, {
      method: "delete",
      headers: headers
    })
      .then(e => e.json())
      .then(e => {
        console.log(e);
      });
  };

  return (
    <div className="App">
      <h1>To do list</h1>
      <Header name={name} onTaskAdded={onTaskAdded} />
      <p className="overline">The tasks are sorted by time</p>
      <div className="parent">
        {copy.map(post => {
          return <Task deleteTask={deleteTask} key={post._id} id={post._id} tasks={post.tasks} name={post.name} time={post.time} />;
        })}
      </div>
      <Footer name={name} />
    </div>
  );
}

export default App;
