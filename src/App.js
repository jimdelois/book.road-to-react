import React from 'react';

import './App.css';

function App() {
  const initialStories = [
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

  const getAsyncStories = () => {
    return new Promise(resolve => setTimeout(
        ()  => resolve({ data: { stories: initialStories } }),
      2500
    ));
  }

  const useSemiPersistedState = (key, initialValue) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialValue
    );

    React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [key, value]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useSemiPersistedState('search', '');
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  // This is the "race-condition-safe" version of using async/await in useEffect.
  React.useEffect(() => {
    (async () => {
      try {
        const res = await getAsyncStories();
        setStories(res.data.stories);
        setIsLoading(false);
      } catch(e) {
        setIsError(true);
      }
    })();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  };

  const handleRemoveStory = (story) => {
    const newStories = stories.filter(s => story.objectId !== s.objectId);
    setStories(newStories);
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

      {isError && <p>Something went wrong, please refresh the page.</p>}
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
      )}
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

const List = ({list, onRemoveItem}) => {
  // Interesting use of rest, and then spread to pass in items by name (which I later reverted
  // so that I could have access to the full item object inside the Item component
  // return list.map(({objectId, ...item}) => <Item key={objectId} {...item} />);
  return list.map(item => <Item key={item.objectId} item={item} onRemoveItem={onRemoveItem} />);
}

const Item = ({item, onRemoveItem}) => {
  return (
    <div>
      <span><a href={item.url}>{item.title}</a></span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <button type="button" onClick={() => onRemoveItem(item)}>Remove</button>
    </div>
  );
}

export default App;
