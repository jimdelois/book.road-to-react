import React from 'react';

import './App.css';

function App() {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan White',
      num_comments: 3,
      points: 4,
      objectId: 0,
    },
    {
      title: 'Redux',
      url: 'https://reduxjs.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectId: 1,
    }
  ];

  const useSemiPersistedState = (key, initialValue) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialValue
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistedState('search', '');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  };

  const searchedStories = stories.filter(
    story => story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" value={searchTerm} onChange={handleSearch}>
        <strong>Search: </strong>
      </InputWithLabel>
      <p>Searching for <strong>{searchTerm}</strong></p>

      <hr />

      <List list={searchedStories}/>
    </div>
  );
}


const InputWithLabel = ({id, value, type='text', onChange, children}) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} type={type} value={value} onChange={onChange}/>
    </>
  );
}

const List = ({list}) => {
  return list.map(({objectId, ...item}) => <Item key={objectId} {...item} />);
}

const Item = ({url, title, author, num_comments, points}) => {
  return (
    <div>
      <span><a href={url}>{title}</a></span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </div>
  );
}

export default App;
